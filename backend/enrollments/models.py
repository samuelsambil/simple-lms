from django.db import models
from django.conf import settings
from courses.models import Course, Lesson


class Enrollment(models.Model):
    """
    Tracks which students are enrolled in which courses.
    """
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    
    # Progress tracking
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    completed = models.BooleanField(default=False)
    
    # Timestamps
    enrolled_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.email} enrolled in {self.course.title}"
    
    class Meta:
        unique_together = ['student', 'course']  # Student can't enroll twice
        ordering = ['-enrolled_date']
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'
    
    def update_progress(self):
        """Calculate and update progress percentage."""
        total_lessons = self.course.lessons.count()
        if total_lessons == 0:
            self.progress_percentage = 0
        else:
            completed_lessons = self.lesson_progress.filter(completed=True).count()
            self.progress_percentage = (completed_lessons / total_lessons) * 100
            
            # Mark enrollment as completed if 100%
            if self.progress_percentage == 100 and not self.completed:
                self.completed = True
                from django.utils import timezone
                self.completed_date = timezone.now()
        
        self.save()


class LessonProgress(models.Model):
    """
    Tracks which lessons a student has completed.
    """
    
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='student_progress'
    )
    
    # Progress tracking
    completed = models.BooleanField(default=False)
    completed_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"{status} {self.enrollment.student.email} - {self.lesson.title}"
    
    class Meta:
        unique_together = ['enrollment', 'lesson']
        ordering = ['lesson__order']
        verbose_name = 'Lesson Progress'
        verbose_name_plural = 'Lesson Progress'