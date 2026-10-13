import api from "./api.js";

export const reportService = {
  getAnalytics: (range = 30) =>
    api
      .get(`/reports/analytics?range=${range}`)
      .then((response) => response.data.data),
};