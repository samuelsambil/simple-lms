from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Quiz, QuizAttempt, StudentAnswer
from .serializers import (
    QuizSerializer,
    QuizDetailSerializer,
    QuizAttemptSerializer,
    QuizAttemptDetailSerializer,
    SubmitQuizSerializer
)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for quizzes.
    
    list: Get all quizzes
    retrieve: Get quiz details with questions
    """
    
    queryset = Quiz.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizSerializer
    
    @action(detail=True, methods=['post'])
    def start_attempt(self, request, pk=None):
        """Start a new quiz attempt."""
        quiz = self.get_object()
        student = request.user
        
        # Check if student can take quiz
        previous_attempts = QuizAttempt.objects.filter(
            student=student,
            quiz=quiz
        ).count()
        
        if previous_attempts >= quiz.max_attempts:
            return Response(
                {'error': f'Maximum attempts ({quiz.max_attempts}) reached'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new attempt
        attempt = QuizAttempt.objects.create(
            student=student,
            quiz=quiz,
            attempt_number=previous_attempts + 1
        )
        
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit quiz answers."""
        quiz = self.get_object()
        student = request.user
        
        serializer = SubmitQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the latest attempt
        try:
            attempt = QuizAttempt.objects.filter(
                student=student,
                quiz=quiz,
                completed_at__isnull=True
            ).latest('started_at')
        except QuizAttempt.DoesNotExist:
            return Response(
                {'error': 'No active attempt found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process answers
        answers_data = serializer.validated_data['answers']
        
        for answer_data in answers_data:
            question_id = answer_data.get('question_id')
            answer_id = answer_data.get('answer_id')
            
            if not question_id or not answer_id:
                continue
            
            try:
                from .models import Question, Answer
                question = Question.objects.get(id=question_id, quiz=quiz)
                answer = Answer.objects.get(id=answer_id, question=question)
                
                # Create student answer
                student_answer = StudentAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=answer,
                    is_correct=answer.is_correct,
                    points_earned=question.points if answer.is_correct else 0
                )
            except (Question.DoesNotExist, Answer.DoesNotExist):
                continue
        
        # Complete attempt
        attempt.completed_at = timezone.now()
        attempt.time_taken_seconds = serializer.validated_data.get('time_taken_seconds')
        attempt.calculate_score()
        
        # Return detailed results
        result_serializer = QuizAttemptDetailSerializer(attempt)
        return Response(result_serializer.data)


class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for quiz attempts.
    
    list: Get all attempts for current user
    retrieve: Get attempt details with answers
    """
    
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only show current user's attempts."""
        return QuizAttempt.objects.filter(student=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizAttemptDetailSerializer
        return QuizAttemptSerializer