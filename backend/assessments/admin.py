from django.contrib import admin
from .models import Quiz, Question, Answer, QuizAttempt, StudentAnswer


class AnswerInline(admin.TabularInline):
    """Show answers inline when editing a question."""
    model = Answer
    extra = 4
    fields = ['answer_text', 'is_correct', 'order']


class QuestionInline(admin.StackedInline):
    """Show questions inline when editing a quiz."""
    model = Question
    extra = 1
    fields = ['question_text', 'question_type', 'points', 'order', 'explanation']


class QuizAdmin(admin.ModelAdmin):
    """Admin interface for Quiz model."""
    
    list_display = ['title', 'lesson', 'passing_score', 'max_attempts', 'created_at']
    list_filter = ['passing_score', 'created_at']
    search_fields = ['title', 'lesson__title', 'lesson__course__title']
    
    inlines = [QuestionInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('lesson', 'title', 'description')
        }),
        ('Settings', {
            'fields': ('passing_score', 'time_limit_minutes', 'max_attempts', 'show_correct_answers')
        }),
    )


class QuestionAdmin(admin.ModelAdmin):
    """Admin interface for Question model."""
    
    list_display = ['question_text', 'quiz', 'question_type', 'points', 'order']
    list_filter = ['question_type', 'quiz']
    search_fields = ['question_text', 'quiz__title']
    
    inlines = [AnswerInline]
    
    fieldsets = (
        ('Question', {
            'fields': ('quiz', 'question_text', 'question_type', 'points', 'order')
        }),
        ('Explanation', {
            'fields': ('explanation',)
        }),
    )


class StudentAnswerInline(admin.TabularInline):
    """Show student answers inline when viewing an attempt."""
    model = StudentAnswer
    extra = 0
    readonly_fields = ['question', 'selected_answer', 'is_correct', 'points_earned', 'answered_at']
    can_delete = False


class QuizAttemptAdmin(admin.ModelAdmin):
    """Admin interface for QuizAttempt model."""
    
    list_display = ['student', 'quiz', 'attempt_number', 'score', 'passed', 'completed_at']
    list_filter = ['passed', 'completed_at', 'quiz']
    search_fields = ['student__email', 'quiz__title']
    readonly_fields = ['started_at', 'completed_at', 'score', 'total_points', 'earned_points']
    
    inlines = [StudentAnswerInline]
    
    fieldsets = (
        ('Attempt Info', {
            'fields': ('student', 'quiz', 'attempt_number')
        }),
        ('Results', {
            'fields': ('score', 'total_points', 'earned_points', 'passed')
        }),
        ('Timing', {
            'fields': ('started_at', 'completed_at', 'time_taken_seconds')
        }),
    )


admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, admin.ModelAdmin)
admin.site.register(QuizAttempt, QuizAttemptAdmin)
admin.site.register(StudentAnswer, admin.ModelAdmin)