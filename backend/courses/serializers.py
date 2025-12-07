from rest_framework import serializers
from .models import Course, Lesson, Category, Review  # Add Review
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

class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model."""
    
    student_name = serializers.SerializerMethodField()
    student_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'course', 'student', 'student_name', 'student_avatar',
            'rating', 'review_text', 'helpful_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student', 'helpful_count', 'created_at', 'updated_at']
    
    def get_student_name(self, obj):
        """Get student's display name."""
        if obj.student.first_name and obj.student.last_name:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return obj.student.email
    
    def get_student_avatar(self, obj):
        """Get student's avatar URL."""
        if obj.student.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.student.avatar.url)
        return None


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews."""
    
    class Meta:
        model = Review
        fields = ['course', 'rating', 'review_text']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def create(self, validated_data):
        """Set student to current user."""
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

class CourseListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for course lists.
    Shows basic info + lesson count.
    """
    
    instructor = InstructorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)
    total_students = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)  # Add this
    review_count = serializers.IntegerField(read_only=True)  # Add this
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'category',
            'difficulty', 'status', 'thumbnail',
            'total_lessons', 'total_students', 
            'average_rating', 'review_count',  # Add these
            'created_at'
        ]

class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for single course view.
    Includes all lessons.
    """
    
    instructor = InstructorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)  # Now this works!
    total_lessons = serializers.IntegerField(read_only=True)
    total_students = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'category',
            'difficulty', 'status', 'thumbnail',
            'lessons', 'reviews', 'total_lessons', 'total_students',
            'average_rating', 'review_count',
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