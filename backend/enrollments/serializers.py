from rest_framework import serializers
from .models import Enrollment, LessonProgress
from courses.serializers import CourseListSerializer, LessonSerializer


class LessonProgressSerializer(serializers.ModelSerializer):
    """Serializer for lesson progress."""
    
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'completed', 'completed_date']
        read_only_fields = ['id', 'completed_date']


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for enrollments."""
    
    course = CourseListSerializer(read_only=True)
    lesson_progress = LessonProgressSerializer(many=True, read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'progress_percentage', 'completed',
            'enrolled_date', 'completed_date', 'lesson_progress'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'completed',
            'enrolled_date', 'completed_date'
        ]


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments."""
    
    class Meta:
        model = Enrollment
        fields = ['course']
    
    def create(self, validated_data):
        # Automatically set student to current user
        validated_data['student'] = self.context['request'].user
        enrollment = super().create(validated_data)
        
        # Create lesson progress for all lessons in the course
        lessons = validated_data['course'].lessons.all()
        for lesson in lessons:
            LessonProgress.objects.create(
                enrollment=enrollment,
                lesson=lesson
            )
        
        return enrollment