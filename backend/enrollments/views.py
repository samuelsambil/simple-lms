from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Enrollment, LessonProgress
from .serializers import (
    EnrollmentSerializer,
    EnrollmentCreateSerializer,
    LessonProgressSerializer
)


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    API endpoints for enrollments.
    
    list: Get current user's enrollments
    create: Enroll in a course
    retrieve: Get enrollment details with progress
    """
    
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only show current user's enrollments."""
        return Enrollment.objects.filter(student=self.request.user)
    
    def get_serializer_class(self):
        """Use create serializer for POST requests."""
        if self.action == 'create':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer
    
    def create(self, request, *args, **kwargs):
        """Enroll student in course."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already enrolled
        course = serializer.validated_data['course']
        if Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response(
                {'error': 'Already enrolled in this course'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Successfully enrolled!'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def complete_lesson(self, request, pk=None):
        """Mark a lesson as complete for this enrollment."""
        enrollment = self.get_object()
        lesson_id = request.data.get('lesson_id')
        
        if not lesson_id:
            return Response(
                {'error': 'lesson_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            lesson_progress = LessonProgress.objects.get(
                enrollment=enrollment,
                lesson_id=lesson_id
            )
            
            lesson_progress.completed = True
            lesson_progress.completed_date = timezone.now()
            lesson_progress.save()
            
            # Update enrollment progress
            enrollment.update_progress()
            
            return Response({
                'message': 'Lesson marked as complete',
                'progress': enrollment.progress_percentage
            })
            
        except LessonProgress.DoesNotExist:
            return Response(
                {'error': 'Lesson progress not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class LessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for lesson progress.
    
    list: Get all lesson progress for current user
    """
    
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only show current user's lesson progress."""
        return LessonProgress.objects.filter(
            enrollment__student=self.request.user
        )