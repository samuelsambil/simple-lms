from django.db import models
from django.conf import settings
from courses.models import Lesson


class Quiz(models.Model):
    """
    A quiz attached to a lesson.
    """
    
    lesson = models.OneToOneField(
        Lesson,
        on_delete=models.CASCADE,
        related_name='quiz'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    passing_score = models.IntegerField(default=70, help_text='Percentage required to pass')
    time_limit_minutes = models.IntegerField(null=True, blank=True, help_text='Time limit in minutes (optional)')
    max_attempts = models.IntegerField(default=3, help_text='Maximum attempts allowed')
    show_correct_answers = models.BooleanField(default=True, help_text='Show correct answers after submission')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.lesson.course.title} - {self.title}"
    
    class Meta:
        verbose_name = 'Quiz'
        verbose_name_plural = 'Quizzes'
        ordering = ['-created_at']
    
    def total_points(self):
        """Calculate total points in quiz."""
        return sum(q.points for q in self.questions.all())


class Question(models.Model):
    """
    A question in a quiz.
    """
    
    QUESTION_TYPE_CHOICES = (
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
    )
    
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default='multiple_choice')
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0)
    explanation = models.TextField(blank=True, help_text='Explanation shown after answering')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}"
    
    class Meta:
        ordering = ['quiz', 'order']
    
    def get_correct_answer(self):
        """Get the correct answer for this question."""
        return self.answers.filter(is_correct=True).first()


class Answer(models.Model):
    """
    An answer option for a question.
    """
    
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    
    answer_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        correct = "✓" if self.is_correct else "✗"
        return f"{correct} {self.answer_text[:50]}"
    
    class Meta:
        ordering = ['question', 'order']


class QuizAttempt(models.Model):
    """
    A student's attempt at taking a quiz.
    """
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    
    attempt_number = models.IntegerField(default=1)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_points = models.IntegerField(default=0)
    earned_points = models.IntegerField(default=0)
    passed = models.BooleanField(default=False)
    
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_taken_seconds = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.email} - {self.quiz.title} (Attempt {self.attempt_number})"
    
    class Meta:
        ordering = ['-started_at']
        unique_together = ['student', 'quiz', 'attempt_number']
    
    def calculate_score(self):
        """Calculate score based on student answers."""
        total = self.quiz.total_points()
        earned = sum(
            sa.points_earned for sa in self.student_answers.all()
        )
        
        self.total_points = total
        self.earned_points = earned
        self.score = (earned / total * 100) if total > 0 else 0
        self.passed = self.score >= self.quiz.passing_score
        self.save()


class StudentAnswer(models.Model):
    """
    A student's answer to a specific question in a quiz attempt.
    """
    
    attempt = models.ForeignKey(
        QuizAttempt,
        on_delete=models.CASCADE,
        related_name='student_answers'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='student_responses'
    )
    selected_answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name='student_selections'
    )
    
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)
    
    answered_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        correct = "✓" if self.is_correct else "✗"
        return f"{correct} {self.question.question_text[:30]}"
    
    class Meta:
        unique_together = ['attempt', 'question']