"""
URL configuration for academe app

"""

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # ========== AUTHENTICATION ==========
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/google/', views.google_auth_view, name='google_auth'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.current_user_view, name='current_user'),
    
    # ========== PROFILE MANAGEMENT ==========
    path('auth/profile/', views.update_profile_view, name='update_profile'),
    path('auth/change-password/', views.change_password_view, name='change_password'),
    path('users/<int:user_id>/', views.user_detail_view, name='user_detail'),
]