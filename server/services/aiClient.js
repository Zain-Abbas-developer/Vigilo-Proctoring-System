import axios from "axios";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const client = axios.create({
  baseURL: env.aiServiceUrl,
  timeout: 30000,
  headers: env.aiServiceKey ? { "X-Service-Key": env.aiServiceKey } : {},
});

async function postToAI(path, payload) {
  try {
    const { data } = await client.post(path, payload);

    if (!data || data.success !== true) {
      throw ApiError.internal(
        data?.message || "AI service returned an invalid response.",
      );
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    const status = err.response?.status;
    const responseData = err.response?.data;

    logger.error("AI service call failed", {
      status: err.response?.status,
      response: err.response?.data,
      message: err.message,
    });

    if (status === 400) {
      throw ApiError.badRequest(
        responseData?.message ||
          responseData?.detail ||
          "AI service rejected the face image.",
      );
    }

    if (err.code === "ECONNREFUSED") {
      throw ApiError.internal("AI service is unavailable.");
    }

    if (err.code === "ECONNABORTED") {
      throw ApiError.internal("AI service timed out. Please try again.");
    }

    throw ApiError.internal("AI service request failed.");
  }
}

export async function enrollFace({ image }) {
  return postToAI("/api/ai/face/enroll/", { image });
}

export async function verifyFace({ referenceEmbedding, verificationImage }) {
  return postToAI("/api/ai/face/verify/", {
    reference_embedding: referenceEmbedding,
    verification_image: verificationImage,
  });
}

export async function health() {
  try {
    const { data } = await client.get("/api/ai/health/");
    return data;
  } catch {
    return { available: false };
  }
}
