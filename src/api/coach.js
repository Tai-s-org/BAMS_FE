import api from "./axios";

const coachApi = {
    getCoachs: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/coach/list', { params: validFilters });
    },
    getManagerById: (userId) => {
        return api.get(`/manager/manager-detail/${userId}`);
    },
    assignMemberToTeam: (data) => {
        return api.put('/manager/assign-manager-to-team', data);
    },
    disableManager: (userId) => {
        return api.put(`/manager/disable-manager/${userId}`);
    },
    updateManager: (data) => {
        return api.put('/manager/update-manager', data);
    },
    listCoaches: (data) => {
        return api.get('/coach/list', {params: data});
    },
};

export default coachApi;
