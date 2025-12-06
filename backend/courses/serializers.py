from rest_framework import serializers
from .models import Course, Lesson, Category  # Update import
from django.contrib.auth import get_user_model

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    course_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'course_count']
    
    def get_course_count(self, obj):
        """Count published courses in this category."""
        return obj.courses.filter(status='published').count()


class InstructorSerializer(serializers.ModelSerializer):
    """Serializer for instructor info in courses."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model."""
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'lesson_type', 
            'video_url', 'text_content', 'order', 'duration', 
            'is_free_preview', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CourseListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for course lists.
    Shows basic info + lesson count.
    """
    
    instructor = InstructorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)  # Add this line
    total_lessons = serializers.IntegerField(read_only=True)
    total_students = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'category',  # Add category here
            'difficulty', 'status', 'thumbnail',
            'total_lessons', 'total_students', 'created_at'
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for single course view.
    Includes all lessons.
    """
    
    instructor = InstructorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)  # Add this line
    lessons = LessonSerializer(many=True, read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)
    total_students = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'category',  # Add category here
            'difficulty', 'status', 'thumbnail',
            'lessons', 'total_lessons', 'total_students',
            'created_at', 'updated_at'
        ]


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating courses (instructors only)."""
    
    class Meta:
        model = Course
        fields = [
            'title', 'description', 'difficulty', 
            'status', 'thumbnail'
        ]
    
    def create(self, validated_data):
        # Automatically set instructor to current user
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)