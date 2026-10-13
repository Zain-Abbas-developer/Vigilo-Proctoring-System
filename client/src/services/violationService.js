import api from './api.js';

export const violationService = {
    list: async () => {
        const response = await api.get('/violations');

        const data = response.data?.data;

        return Array.isArray(data) ? data : data?.items || data?.violations || [];
    },

    review: async (id, payload) => {
        const response = await api.put(`/violations/${id}/review`, payload);
        return response.data?.data;
    },
}