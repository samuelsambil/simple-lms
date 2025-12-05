from django.contrib import admin
from .models import Enrollment, LessonProgress


class LessonProgressInline(admin.TabularInline):
    """Show lesson progress when editing an enrollment."""
    model = LessonProgress
    extra = 0
    fields = ['lesson', 'completed', 'completed_date']
    readonly_fields = ['completed_date']


class EnrollmentAdmin(admin.ModelAdmin):
    """Admin interface for Enrollment model."""
    
    list_display = ['student', 'course', 'progress_percentage', 'completed', 'enrolled_date']
    list_filter = ['completed', 'enrolled_date', 'course']
    search_fields = ['student__email', 'course__title']
    
    inlines = [LessonProgressInline]
    
    readonly_fields = ['enrolled_date', 'completed_date', 'progress_percentage']
    
    fieldsets = (
        ('Enrollment Info', {
            'fields': ('student', 'course')
        }),
        ('Progress', {
            'fields': ('progress_percentage', 'completed', 'enrolled_date', 'completed_date')
        }),
    )


class LessonProgressAdmin(admin.ModelAdmin):
    """Admin interface for LessonProgress model."""
    
    list_display = ['enrollment', 'lesson', 'completed', 'completed_date']
    list_filter = ['completed', 'lesson__course']
    search_fields = ['enrollment__student__email', 'lesson__title']


admin.site.register(Enrollment, EnrollmentAdmin)
admin.site.register(LessonProgress, LessonProgressAdmin)