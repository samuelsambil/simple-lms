"""
URL configuration for academe app

"""

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('google/', views.google_auth_view, name='google_auth'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.current_user_view, name='current_user'),
    path('profile/', views.update_profile_view, name='update_profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('users/<int:user_id>/', views.user_detail_view, name='user_detail'),
]
