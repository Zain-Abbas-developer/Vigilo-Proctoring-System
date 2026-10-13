
from django.urls import path

from .views import (
    health_check,
    detect_face,
    enroll_face,
    verify_face,
)

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("face-detection/", detect_face, name="face_detection"),
    path("face/enroll/", enroll_face, name="face_enroll"),
    path("face/verify/", verify_face, name="face_verify"),
]