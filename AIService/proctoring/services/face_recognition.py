
import os

import numpy as np
from insightface.app import FaceAnalysis


_model = None


def get_model():
    global _model

    if _model is None:
        _model = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"],
        )
        _model.prepare(
            ctx_id=-1,
            det_size=(640, 640),
        )

    return _model


def extract_embedding(image):
    if image is None:
        raise ValueError("Image is required.")

    faces = get_model().get(image)

    if len(faces) == 0:
        raise ValueError("No face detected.")

    if len(faces) > 1:
        raise ValueError("Only one face is allowed.")

    embedding = np.asarray(
        faces[0].embedding,
        dtype=np.float32,
    )

    norm = np.linalg.norm(embedding)
    if norm == 0 or not np.isfinite(norm):
        raise ValueError("Unable to process this face.")

    embedding = embedding / norm

    return embedding.tolist()


def compare_embeddings(reference, live):
    reference = np.asarray(reference, dtype=np.float32)
    live = np.asarray(live, dtype=np.float32)

    if (
        reference.ndim != 1
        or live.ndim != 1
        or reference.shape != live.shape
        or not np.all(np.isfinite(reference))
        or not np.all(np.isfinite(live))
    ):
        raise ValueError("Invalid face embedding.")

    reference_norm = np.linalg.norm(reference)
    live_norm = np.linalg.norm(live)

    if reference_norm == 0 or live_norm == 0:
        raise ValueError("Invalid face embedding.")

    similarity = float(
        np.dot(reference, live)
        / (reference_norm * live_norm)
    )

    threshold = float(
        os.getenv("FACE_MATCH_THRESHOLD", "0.45")
    )

    return {
        "verified": similarity >= threshold,
        "similarity": round(similarity, 4),
        "threshold": threshold,
    }