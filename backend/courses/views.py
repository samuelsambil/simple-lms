from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Course, Lesson, Category  # Add Category
from .serializers import (
    CourseListSerializer, 
    CourseDetailSerializer,
    CourseCreateSerializer,
    LessonSerializer,
    CategorySerializer  # Add this
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