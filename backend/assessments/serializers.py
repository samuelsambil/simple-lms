from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizAttempt, StudentAnswer


class AnswerSerializer(serializers.ModelSerializer):
    """Serializer for Answer model."""
    
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'order']
        # Don't include is_correct - students shouldn't see the answer!


class AnswerWithCorrectSerializer(serializers.ModelSerializer):
    """Serializer for Answer model with correct answer shown."""
    
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model (for taking quiz)."""
    
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'points', 'order', 'answers']


class QuestionWithAnswersSerializer(serializers.ModelSerializer):
    """Serializer for Question with correct answers shown (after submission)."""
    
    answers = AnswerWithCorrectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'points', 'order', 'explanation', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model (basic info)."""
    
    total_points = serializers.IntegerField(read_only=True)
    total_questions = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'lesson', 'title', 'description',
            'passing_score', 'time_limit_minutes', 'max_attempts',
            'total_points', 'total_questions'
        ]
    
    def get_total_questions(self, obj):
        return obj.questions.count()


class QuizDetailSerializer(serializers.ModelSerializer):
    """Serializer for Quiz with questions (for taking quiz)."""
    
    questions = QuestionSerializer(many=True, read_only=True)
    total_points = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'lesson', 'title', 'description',
            'passing_score', 'time_limit_minutes', 'max_attempts',
            'show_correct_answers', 'questions', 'total_points'
        ]


class StudentAnswerSerializer(serializers.ModelSerializer):
    """Serializer for StudentAnswer (for results)."""
    
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    selected_answer_text = serializers.CharField(source='selected_answer.answer_text', read_only=True)
    correct_answer_text = serializers.SerializerMethodField()
    explanation = serializers.CharField(source='question.explanation', read_only=True)
    
    class Meta:
        model = StudentAnswer
        fields = [
            'id', 'question', 'question_text', 'selected_answer',
            'selected_answer_text', 'correct_answer_text', 'is_correct',
            'points_earned', 'explanation'
        ]
    
    def get_correct_answer_text(self, obj):
        correct = obj.question.get_correct_answer()
        return correct.answer_text if correct else None


class QuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for QuizAttempt."""
    
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'student', 'student_email',
            'attempt_number', 'score', 'total_points', 'earned_points',
            'passed', 'started_at', 'completed_at', 'time_taken_seconds'
        ]
        read_only_fields = [
            'student', 'score', 'total_points', 'earned_points',
            'passed', 'started_at', 'completed_at'
        ]


class QuizAttemptDetailSerializer(serializers.ModelSerializer):
    """Serializer for QuizAttempt with all answers."""
    
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    student_answers = StudentAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'attempt_number',
            'score', 'total_points', 'earned_points', 'passed',
            'started_at', 'completed_at', 'time_taken_seconds',
            'student_answers'
        ]


class SubmitQuizSerializer(serializers.Serializer):
    """Serializer for submitting quiz answers."""
    
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    time_taken_seconds = serializers.IntegerField(required=False)