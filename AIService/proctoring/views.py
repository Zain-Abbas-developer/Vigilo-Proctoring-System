
import hmac
import os

from httpx import request
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.face_detection import FaceDetector
from .services.face_recognition import (
    extract_embedding,
    compare_embeddings,
)
from .services.image_utils import decode_image


def service_authorized(request):
    expected = os.getenv("AI_SERVICE_KEY", "")
    supplied = request.headers.get("X-Service-Key", "")

    return bool(expected) and hmac.compare_digest(
        expected,
        supplied,
    )


@api_view(["GET"])
def health_check(request):
    return Response({
        "available": True,
        "service": "Vigilo AI Service",
    })



@api_view(["POST"])
def detect_face(request):
    if not service_authorized(request):
        return Response(
            {"success": False, "message": "Unauthorized service."},
            status=401,
        )

    print("CONTENT TYPE:", request.content_type)
    print("FILES:", list(request.FILES.keys()))
    print("DATA KEYS:", list(request.data.keys()))

    image_file = request.FILES.get("image")

    if image_file is None:
        return Response(
            {
                "success": False,
                "message": "Image is missing from request.FILES.",
                "received_files": list(request.FILES.keys()),
                "received_data": list(request.data.keys()),
            },
            status=400,
        )

    try:
        import cv2
        import numpy as np

        image_bytes = image_file.read()

        print("IMAGE SIZE:", len(image_bytes))
        print("IMAGE CONTENT TYPE:", image_file.content_type)

        if not image_bytes:
            return Response(
                {"success": False, "message": "Uploaded image is empty."},
                status=400,
            )

        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            return Response(
                {
                    "success": False,
                    "message": "Uploaded file is not a valid supported image.",
                },
                status=400,
            )

        with FaceDetector() as detector:
            faces = detector.detect(image)

        if len(faces) == 0:
            status = "no_face"
        elif len(faces) == 1:
            status = "single_face"
        else:
            status = "multiple_faces"

        return Response({
            "success": True,
            "face_count": len(faces),
            "status": status,
            "faces": faces,
        })

    except Exception as error:
        print("FACE DETECTION ERROR:", repr(error))

        return Response(
            {
                "success": False,
                "message": "Face detection failed.",
                "error": str(error),
            },
            status=500,
        )


@api_view(["POST"])
def enroll_face(request):
    if not service_authorized(request):
        return Response(
            {"success": False, "message": "Unauthorized service."},
            status=401,
        )

    try:
        image = decode_image(request.data.get("image"))
        embedding = extract_embedding(image)

        return Response({
            "success": True,
            "embedding": embedding,
            "message": "Face enrollment image processed.",
        })

    except ValueError as error:
        return Response(
            {"success": False, "message": str(error)},
            status=400,
        )


@api_view(["POST"])
def verify_face(request):
    if not service_authorized(request):
        return Response(
            {"success": False, "message": "Unauthorized service."},
            status=401,
        )

    try:
        reference = request.data.get("reference_embedding")
        live_image = decode_image(
            request.data.get("verification_image")
        )

        if not isinstance(reference, list):
            raise ValueError(
                "Registered face embedding is required."
            )

        live_embedding = extract_embedding(live_image)
        result = compare_embeddings(
            reference,
            live_embedding,
        )

        return Response({
            "success": True,
            **result,
            "message": (
                "Face matched."
                if result["verified"]
                else "Face did not match."
            ),
        })

    except ValueError as error:
        return Response(
            {
                "success": False,
                "verified": False,
                "message": str(error),
            },
            status=400,
        )