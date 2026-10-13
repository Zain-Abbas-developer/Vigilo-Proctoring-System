
import base64
import binascii
import re

import cv2
import numpy as np
from django.conf import settings


def decode_image(image_data):
    if not isinstance(image_data, str) or not image_data:
        raise ValueError("Image is required.")

    # Accept a base64 data URL or raw base64 string.
    if image_data.startswith("data:"):
        match = re.fullmatch(
            r"data:image/(jpeg|jpg|png|webp);base64,(.+)",
            image_data,
            flags=re.IGNORECASE | re.DOTALL,
        )
        if not match:
            raise ValueError("Unsupported image format.")
        image_data = match.group(2)

    try:
        image_bytes = base64.b64decode(image_data, validate=True)
    except (binascii.Error, ValueError):
        raise ValueError("Invalid base64 image.")

    max_bytes = int(
        getattr(settings, "MAX_IMAGE_SIZE_MB", 5)
    ) * 1024 * 1024

    if not image_bytes or len(image_bytes) > max_bytes:
        raise ValueError("Image is empty or exceeds the size limit.")

    buffer = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(buffer, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Unable to decode image.")

    height, width = image.shape[:2]
    if width < 100 or height < 100:
        raise ValueError("Image resolution is too small.")

    return image