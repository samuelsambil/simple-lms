from .settings import *
import dj_database_url

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['.onrender.com', '.vercel.app']

# Database
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True