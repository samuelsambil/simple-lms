from django.db import models
from django.conf import settings
from .validators import validate_video_file, validate_video_content_type


class Category(models.Model):
    """
    Course categories (e.g., Programming, Design, Business)
    """
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Emoji or icon name')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']


class Course(models.Model):
    """
    A course that instructors create and students enroll in.
    """
    
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    
    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_created'
    )
    
    # Category - ADD THIS
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses'
    )
    
    # Course Details
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Thumbnail (optional for now)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
    
    def total_lessons(self):
        """Count total lessons in this course."""
        return self.lessons.count()
    
    def total_students(self):
        """Count students enrolled in this course."""
        return self.enrollments.count()
    
    # Add these new methods below total_students:
    
    def average_rating(self):
        """Calculate average rating from reviews."""
        reviews = self.reviews.all()
        if reviews.count() == 0:
            return 0
        total = sum(review.rating for review in reviews)
        return round(total / reviews.count(), 1)
    
    def review_count(self):
        """Count total reviews."""
        return self.reviews.count()


class Lesson(models.Model):
    """
    A lesson within a course.
    Can be a video lesson or text-based lesson.
    """
    
    # ADD THIS - Lesson Type Choices
    LESSON_TYPE_CHOICES = (
        ('video', 'Video'),
        ('text', 'Text'),
    )
    
    # Relationships
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    
    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # ADD THIS FIELD
    lesson_type = models.CharField(
        max_length=20,
        choices=LESSON_TYPE_CHOICES,
        default='video',
        help_text='Type of lesson content'
    )
    
    order = models.IntegerField(default=0, help_text='Order within the course')
    duration = models.IntegerField(default=0, help_text='Duration in minutes')
    
    # Content
    video_url = models.URLField(
        blank=True,
        help_text='YouTube video URL (if not uploading file)'
    )
    video_file = models.FileField(
        upload_to='lesson_videos/',
        blank=True,
        null=True,
        validators=[validate_video_file, validate_video_content_type],
        help_text='Upload video file directly (MP4, MOV, AVI, MKV, WEBM) - Max 500MB'
    )
    text_content = models.TextField(
        blank=True,
        help_text='Lesson content in Markdown'
    )
    
    # Settings
    is_free_preview = models.BooleanField(
        default=False,
        help_text='Allow non-enrolled students to preview this lesson'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['course', 'order']
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        
class Review(models.Model):
    """
    Student reviews and ratings for courses.
    """
    
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_written'
    )
    
    rating = models.IntegerField(choices=RATING_CHOICES)
    review_text = models.TextField(blank=True)
    
    # Helpfulness tracking
    helpful_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.email} - {self.course.title} ({self.rating}★)"
    
    class Meta:
        unique_together = ['course', 'student']  # One review per student per course
        ordering = ['-created_at']
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'


class Discussion(models.Model):
    """
    A discussion thread in a course.
    """
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='discussions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='discussions_created'
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    upvotes = models.IntegerField(default=0)
    is_pinned = models.BooleanField(default=False, help_text='Pinned by instructor')
    is_resolved = models.BooleanField(default=False, help_text='Question answered')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        verbose_name = 'Discussion'
        verbose_name_plural = 'Discussions'
    
    def comment_count(self):
        """Count total comments."""
        return self.comments.count()


class Comment(models.Model):
    """
    A comment on a discussion thread.
    """
    
    discussion = models.ForeignKey(
        Discussion,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments_created'
    )
    parent_comment = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    content = models.TextField()
    upvotes = models.IntegerField(default=0)
    is_instructor_reply = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Comment by {self.user.email} on {self.discussion.title}"
    
    class Meta:
        ordering = ['created_at']
    
    def save(self, *args, **kwargs):
        # Auto-detect if this is from the course instructor
        if self.user == self.discussion.course.instructor:
            self.is_instructor_reply = True
        super().save(*args, **kwargs)