import api from './api.js';
export const analyticsService = {
    admin: () => api.get("/analytics/admin").then((r) => r.data.data),
    teacher: () => api.get("/analytics/teacher").then((r) => r.data.data),
    student: () => api.get("/analytics/student").then((r) => r.data.data),
}