from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Course, Lesson, Category, Review
from .serializers import (
    CourseListSerializer, 
    CourseDetailSerializer,
    CourseCreateSerializer,
    LessonSerializer,
    CategorySerializer,
    ReviewSerializer,
    ReviewCreateSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoints for courses.
    
    list: Get all published courses
    retrieve: Get single course details
    create: Create new course (instructors only)
    update: Update course (instructor only)
    delete: Delete course (instructor only)
    """
    
    queryset = Course.objects.filter(status='published')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # Add this
    search_fields = ['title', 'description', 'instructor__email', 'instructor__first_name', 'instructor__last_name']  # Add this
    ordering_fields = ['created_at', 'title']  # Add this
    ordering = ['-created_at']  # Add this - default ordering
    
    def get_serializer_class(self):
        """Use different serializers for different actions."""
        if self.action == 'list':
            return CourseListSerializer
        elif self.action == 'create' or self.action == 'update':
            return CourseCreateSerializer
        return CourseDetailSerializer
    
    def get_permissions(self):
        """Anyone can view courses, but only instructors can create."""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        """Only instructors can create courses."""
        if self.request.user.role != 'instructor':
            raise PermissionError("Only instructors can create courses")
        serializer.save()
    
    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Get all lessons for a course."""
        course = self.get_object()
        lessons = course.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    # Add this new action below lessons
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get detailed analytics for a course (instructors only)."""
        course = self.get_object()
        
        # Check if user is the instructor
        if course.instructor != request.user:
            return Response(
                {'error': 'Only the course instructor can view analytics'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        from enrollments.models import Enrollment
        
        # Get all enrollments for this course
        enrollments = Enrollment.objects.filter(course=course)
        
        # Basic stats
        total_students = enrollments.count()
        completed_students = enrollments.filter(completed=True).count()
        completion_rate = (completed_students / total_students * 100) if total_students > 0 else 0
        
        # Average progress
        avg_progress = enrollments.aggregate(Avg('progress_percentage'))['progress_percentage__avg'] or 0
        
        # Enrollments over time (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_enrollments = enrollments.filter(enrolled_date__gte=thirty_days_ago)
        
        # Group by date
        enrollment_timeline = []
        for i in range(30):
            date = timezone.now() - timedelta(days=29-i)
            count = recent_enrollments.filter(
                enrolled_date__date=date.date()
            ).count()
            enrollment_timeline.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count
            })
        
        # Reviews stats
        reviews = course.reviews.all()
        rating_distribution = {
            '5': reviews.filter(rating=5).count(),
            '4': reviews.filter(rating=4).count(),
            '3': reviews.filter(rating=3).count(),
            '2': reviews.filter(rating=2).count(),
            '1': reviews.filter(rating=1).count(),
        }
        
        # Progress distribution
        progress_ranges = {
            '0-25%': enrollments.filter(progress_percentage__lt=25).count(),
            '25-50%': enrollments.filter(progress_percentage__gte=25, progress_percentage__lt=50).count(),
            '50-75%': enrollments.filter(progress_percentage__gte=50, progress_percentage__lt=75).count(),
            '75-100%': enrollments.filter(progress_percentage__gte=75).count(),
        }
        
        return Response({
            'total_students': total_students,
            'completed_students': completed_students,
            'completion_rate': round(completion_rate, 1),
            'average_progress': round(avg_progress, 1),
            'average_rating': course.average_rating(),
            'total_reviews': reviews.count(),
            'enrollment_timeline': enrollment_timeline,
            'rating_distribution': rating_distribution,
            'progress_distribution': progress_ranges,
        })


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for lessons.
    
    list: Get all lessons
    retrieve: Get single lesson details
    """
    
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter lessons by course if course_id is provided."""
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for categories.
    
    list: Get all categories with course counts
    retrieve: Get single category details
    """
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'  # Allow lookup by slug instead of ID
    
 
class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoints for course reviews.
    
    list: Get all reviews (can filter by course)
    create: Create a review (students only, must be enrolled)
    retrieve: Get single review
    update: Update own review
    delete: Delete own review
    """
    
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter reviews by course if provided."""
        queryset = Review.objects.all()
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset
    
    def get_serializer_class(self):
        """Use create serializer for POST requests."""
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def get_serializer_context(self):
        """Pass request to serializer for avatar URLs."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Create a review (must be enrolled, can't review own course)."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        course = serializer.validated_data['course']
        
        # Check if user is the instructor
        if course.instructor == request.user:
            return Response(
                {'error': 'Instructors cannot review their own courses'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if student is enrolled
        from enrollments.models import Enrollment
        if not Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response(
                {'error': 'You must be enrolled in this course to review it'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already reviewed
        if Review.objects.filter(student=request.user, course=course).exists():
            return Response(
                {'error': 'You have already reviewed this course'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        """Only allow users to update their own reviews."""
        review = self.get_object()
        if review.student != request.user:
            return Response(
                {'error': 'You can only edit your own reviews'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Only allow users to delete their own reviews."""
        review = self.get_object()
        if review.student != request.user:
            return Response(
                {'error': 'You can only delete your own reviews'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)   