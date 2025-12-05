from django.contrib import admin
from .models import Course, Lesson


class LessonInline(admin.TabularInline):
    """
    Show lessons inline when editing a course.
    Makes it easy to add lessons directly from the course page.
    """
    model = Lesson
    extra = 1  # Show 1 empty lesson form
    fields = ['title', 'lesson_type', 'video_url', 'order', 'duration', 'is_free_preview']


class CourseAdmin(admin.ModelAdmin):
    """Admin interface for Course model."""
    
    list_display = ['title', 'instructor', 'difficulty', 'status', 'total_lessons', 'total_students', 'created_at']
    list_filter = ['status', 'difficulty', 'created_at']
    search_fields = ['title', 'description', 'instructor__email']
    
    # Show lessons inside course edit page
    inlines = [LessonInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'instructor')
        }),
        ('Course Settings', {
            'fields': ('difficulty', 'status', 'thumbnail')
        }),
    )
    
    def total_lessons(self, obj):
        return obj.total_lessons()
    total_lessons.short_description = 'Lessons'
    
    def total_students(self, obj):
        return obj.total_students()
    total_students.short_description = 'Students'


class LessonAdmin(admin.ModelAdmin):
    """Admin interface for Lesson model."""
    
    list_display = ['title', 'course', 'lesson_type', 'order', 'duration', 'is_free_preview', 'created_at']
    list_filter = ['lesson_type', 'is_free_preview', 'course']
    search_fields = ['title', 'description', 'course__title']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('course', 'title', 'description')
        }),
        ('Content', {
            'fields': ('lesson_type', 'video_url', 'text_content')
        }),
        ('Settings', {
            'fields': ('order', 'duration', 'is_free_preview')
        }),
    )


admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)