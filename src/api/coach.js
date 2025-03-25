import api from "./axios";

const coachApi = {
    getManagers: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/manager/list-manager-filter-and-paging', { params: validFilters });
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
};

export default coachApi;
