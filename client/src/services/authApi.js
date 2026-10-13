import api from './api.js';
export const authApi = {
  register: (p) => api.post("/auth/register", p).then((r) => r.data.data),
  login: (p)  => api.post("/auth/login", p).then((r) => r.data.data),
  me: () => api.get("/auth/me").then((r) => r.data.data),
  logout: () => api.post("/auth/logout"),
  changePassword: (p) => api.post("/auth/change-password", p).then((r) => r.data.data),
  forgotPassword: (p) => api.post("/auth/forgot-password", p).then((r) => r.data.data),
  resetPassword: (token, p) => api.put(`/auth/reset-password/${token}`, p).then((r) => r.data.data),
  contactAdmin: (p) => api.post("/auth/contact-admin", p).then((r) => r.data.data),
  // saveReferenceImage: (image) => api.post("/auth/reference-image", image).then((r) => r.data.data),
}