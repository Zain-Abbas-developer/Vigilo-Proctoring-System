import api from "./api.js";

export const attemptService = {
  // Start a new exam attempt
  start: async (examId) => {
    const response = await api.post(
      `/attempts/exam/${examId}/start`
    );

    return response.data.data;
  },

  // Get existing active attempt
  // Return null if no active attempt exists
  active: async (examId) => {
    try {
      const response = await api.get(
        `/attempts/exam/${examId}/active`
      );

      return response.data.data;
    } catch (error) {
      const status =
        error?.response?.status ??
        error?.status ??
        error?.statusCode;

      const message =
        error?.response?.data?.message ??
        error?.data?.message ??
        error?.message;

      if (
        status === 404 &&
        message === "No active attempt"
      ) {
        return null;
      }

      throw error;
    }
  },

  // Get exam paper
  paper: async (examId) => {
    const response = await api.get(
      `/attempts/exam/${examId}/paper`
    );

    return response.data.data;
  },

  // Save an answer
  saveAnswer: async (attemptId, payload) => {
    const response = await api.post(
      `/attempts/${attemptId}/answer`,
      payload
    );

    return response.data.data;
  },

  // Submit attempt
  submit: async (attemptId, auto = false) => {
    const response = await api.post(
      `/attempts/${attemptId}/submit`,
      { auto }
    );

    return response.data.data;
  },

  // Verify student's face
  verifyFace: async (attemptId, verificationImage) => {
    const response = await api.post(
      `/attempts/${attemptId}/verify-face`,
      { verificationImage }
    );

    return response.data.data;
  },

  // List attempts
  list: async (params = {}) => {
    const response = await api.get("/attempts", {
      params,
    });

    return response.data.data;
  },

  // Get attempt details
  get: async (id) => {
    const response = await api.get(`/attempts/${id}`);

    return response.data.data;
  },

  // Get attempt result
  result: async (attemptId) => {
    const response = await api.get(
      `/results/${attemptId}`
    );

    return response.data.data;
  },
};
