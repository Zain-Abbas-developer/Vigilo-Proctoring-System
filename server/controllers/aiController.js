import User from "../models/User.js";

import {
  enrollFace as enrollFaceWithAI,
  verifyFace,
  health,
} from "../services/aiClient.js";

import {
  encryptEmbedding,
  decryptEmbedding,
} from "../utils/faceEmbeddingCrypto.js";

import { ok, asyncHandler } from "../utils/response.js";

import ApiError from "../utils/ApiError.js";

function getStudentId(req) {
  if (req.user?.role !== "student") {
    throw ApiError.forbidden(
      "Only authenticated students can use face verification.",
    );
  }

  const id = req.user._id || req.user.id;

  if (!id) {
    throw ApiError.unauthorized("Authentication is required.");
  }

  return id;
}

export const enroll = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const { image } = req.body;

  if (typeof image !== "string" || !image) {
    throw ApiError.badRequest("A face enrollment image is required.");
  }

  const result = await enrollFaceWithAI({ image });

  console.log("AI enrollment response:", {
    success: result?.success,
    hasEmbedding: Array.isArray(result?.embedding),
    embeddingLength: result?.embedding?.length,
    message: result?.message,
  });

  if (
    !Array.isArray(result.embedding) ||
    result.embedding.length === 0 ||
    !result.embedding.every(Number.isFinite)
  ) {
    throw ApiError.internal("AI service returned an invalid face embedding.");
  }

  const encryptedEmbedding = encryptEmbedding(result.embedding);

  await User.findByIdAndUpdate(studentId, {
    $set: {
      faceEmbedding: encryptedEmbedding,
      faceEnrolled: true,
      faceModelVersion: "insightface-buffalo_l",
      faceEnrolledAt: new Date(),
    },
  });

  return ok(
    res,
    {
      faceEnrolled: true,
      enrolledAt: new Date(),
    },
    "Face enrollment completed.",
  );
});

export const verify = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const { verificationImage } = req.body;

  if (typeof verificationImage !== "string" || !verificationImage) {
    throw ApiError.badRequest("A live verification image is required.");
  }

  const student = await User.findById(studentId).select("+faceEmbedding");

  if (!student || !student.faceEnrolled || !student.faceEmbedding) {
    throw ApiError.badRequest(
      "Face enrollment is required before verification.",
    );
  }

  let referenceEmbedding;

  try {
    referenceEmbedding = decryptEmbedding(student.faceEmbedding);
  } catch {
    throw ApiError.internal("Stored face enrollment could not be read.");
  }

  const result = await verifyFace({
    referenceEmbedding,
    verificationImage,
  });

  return ok(
    res,
    {
      verified: result.verified === true,
      similarity: result.similarity,
      threshold: result.threshold,
      message: result.message,
    },
    result.message || "Face verification completed.",
  );
});

export const aiHealth = asyncHandler(async (req, res) => {
  return ok(res, await health());
});
