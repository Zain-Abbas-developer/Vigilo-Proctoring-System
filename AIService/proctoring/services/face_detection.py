
from pathlib import Path

import cv2
import mediapipe as mp


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "blaze_face_short_range.tflite"
)


class FaceDetection:
    def __init__(self, min_detection_confidence=0.5):
        if not MODEL_PATH.is_file():
            raise FileNotFoundError(
                f"Face detector model not found: {MODEL_PATH}"
            )

        self._detector = mp.tasks.vision.FaceDetector.create_from_options(
            mp.tasks.vision.FaceDetectorOptions(
                base_options=mp.tasks.BaseOptions(
                    model_asset_path=str(MODEL_PATH)
                ),
                running_mode=mp.tasks.vision.RunningMode.IMAGE,
                min_detection_confidence=min_detection_confidence,
            )
        )

    def detect(self, image):
        if image is None or not hasattr(image, "shape"):
            raise ValueError("A valid OpenCV image is required.")

        if len(image.shape) != 3 or image.shape[2] != 3:
            raise ValueError("Image must have three color channels.")

        height, width = image.shape[:2]

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_image,
        )

        if self._detector is None:
            raise RuntimeError("Face detector is closed.")

        result = self._detector.detect(mp_image)
        faces = []

        for detection in result.detections:
            bbox = detection.bounding_box
            confidence = (
                float(detection.categories[0].score)
                if detection.categories
                else 0.0
            )

            faces.append({
                "x": max(0.0, bbox.origin_x / width),
                "y": max(0.0, bbox.origin_y / height),
                "width": max(0.0, bbox.width / width),
                "height": max(0.0, bbox.height / height),
                "confidence": confidence,
            })

        return faces

    def close(self):
        if self._detector is not None:
            self._detector.close()
            self._detector = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()
        return False


FaceDetector = FaceDetection