from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, CurrentUserView, UserProfileView

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Current user
    path('me/', CurrentUserView.as_view(), name='current_user'),
    
    # Public profiles
    path('users/<int:pk>/', UserProfileView.as_view(), name='user_profile'),
]