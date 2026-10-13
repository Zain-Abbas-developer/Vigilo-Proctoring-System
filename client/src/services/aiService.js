import api from "./api.js";

export const aiService = {
  health: async () => {
    const response = await api.get("/ai/health");

    return response.data?.data ?? response.data;
  },

  verifyFace: async ({ verificationImage }) => {
    const response = await api.post("/ai/face/verify", {
      verificationImage,
    });

    return response.data?.data ?? response.data;
  },

  enrollFace: async ({ image }) => {
    const response = await api.post("/ai/face/enroll", {
      image,
    });

    return response.data?.data ?? response.data;
  },
};

export default aiService;
