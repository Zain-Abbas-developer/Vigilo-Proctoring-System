import api from './api.js';

export const examService = {
  list: (params) => api.get('/exams', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/exams/${id}`).then((r) => r.data.data),
  create: (p) => api.post('/exams', p).then((r) => r.data.data),
  update: (id, p) => api.put(`/exams/${id}`, p).then((r) => r.data.data),
  remove: (id) => api.delete(`/exams/${id}`).then((r) => r.data.data),
  publish: (id) => api.post(`/exams/${id}/publish`).then((r) => r.data.data),
  assign: (id, studentIds) => api.post(`/exams/${id}/assign`, { studentIds }).then((r) => r.data.data),
  listQuestions: (examId) => api.get(`/exams/${examId}/questions`).then((r) => r.data.data),
  addQuestion: (examId, p) => api.post(`/exams/${examId}/questions`, p).then((r) => r.data.data),
  bulkQuestions: (examId, questions) => api.post(`/exams/${examId}/questions/bulk`, { questions }).then((r) => r.data.data),
  updateQuestion: (id, p) => api.put(`/questions/${id}`, p).then((r) => r.data.data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`).then((r) => r.data.data),
};