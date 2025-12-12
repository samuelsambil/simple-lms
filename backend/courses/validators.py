from django.core.exceptions import ValidationError
from django.conf import settings
import os


def validate_video_file(file):
    """
    Validate uploaded video file.
    Checks file extension and size.
    """
    # Check file extension
    ext = os.path.splitext(file.name)[1].lower()
    allowed_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    
    if ext not in allowed_extensions:
        raise ValidationError(
            f'Unsupported file extension. Allowed formats: MP4, MOV, AVI, MKV, WEBM'
        )
    
    # Check file size (500MB max)
    max_size = 500 * 1024 * 1024  # 500MB
    if file.size > max_size:
        max_size_mb = max_size / (1024 * 1024)
        raise ValidationError(
            f'File size exceeds maximum allowed size of {max_size_mb}MB'
        )
    
    return file


def validate_video_content_type(file):
    """
    Validate video content type.
    """
    allowed_types = [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/webm'
    ]
    
    if hasattr(file, 'content_type') and file.content_type not in allowed_types:
        raise ValidationError(
            f'Invalid video format. Content type: {file.content_type}'
        )
    
    return file