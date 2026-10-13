import api from "./api.js";

export const questionService = {
  list: (params) =>
    api.get("/questions", { params }).then((r) => r.data.data),

  listBank: (params) =>
    api.get("/questions/bank", { params }).then((r) => r.data.data),

  get: (id) =>
    api.get(`/questions/${id}`).then((r) => r.data.data),

  create: (payload) =>
    api.post("/questions", payload).then((r) => r.data.data),

  update: (id, payload) =>
    api.put(`/questions/${id}`, payload).then((r) => r.data.data),

  remove: (id) =>
    api.delete(`/questions/${id}`).then((r) => r.data.data),
};