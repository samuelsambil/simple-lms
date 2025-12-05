from django.db import models
from django.conf import settings


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


class Lesson(models.Model):
    """
    A lesson belongs to a course. Can be video or text.
    """
    
    LESSON_TYPE_CHOICES = (
        ('video', 'Video'),
        ('text', 'Text'),
    )
    
    # Which course this belongs to
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    
    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Content
    lesson_type = models.CharField(max_length=10, choices=LESSON_TYPE_CHOICES, default='video')
    video_url = models.URLField(blank=True, help_text='YouTube video URL')
    text_content = models.TextField(blank=True, help_text='Text lesson content (supports Markdown)')
    
    # Order
    order = models.PositiveIntegerField(default=0, help_text='Lesson order in the course')
    
    # Duration (in minutes)
    duration = models.PositiveIntegerField(default=0, help_text='Lesson duration in minutes')
    
    # Free preview
    is_free_preview = models.BooleanField(default=False, help_text='Can anyone watch without enrolling?')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['course', 'order']
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'