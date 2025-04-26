import api from "./axios";

const coachApi = {
    getCoachs: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/coach/list', { params: validFilters });
    },
    getCoachById: (userId) => {
        return api.get(`/coach/detail/${userId}`);
    },
    createNewCoachAccount: (data) => {
        return api.post('/coach/create', data);
    },
    updateCoach: (data) => {
        return api.put('/coach/update', data);
    },
    listCoaches: (data) => {
        return api.get('/coach/list', { params: data });
    },
    changeCoachStatus: (userId) => {
        return api.patch(`/coach/change-status/${userId}`);
    },
    assignCoachToTeam: (data) => {
        return api.patch(`/api/coach/assign-to-team`, data);
    },
};

export default coachApi;
