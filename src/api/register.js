import api from "./axios";

const registerApi = {
    managerRegister: (data) => {
        return api.post('/manager-registration/register', data);
    },
    getAllManagerRegistration: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/manager-registration/list', { params: validFilters });
    },
    approveManager: (id) => {
        return api.post(`/manager-registration/approve/${id}`);
    },
    rejectManager: (id) => {
        return api.post(`/manager-registration/reject/${id}`);
    },
    updateManagerForm: (data) => {
        return api.post('/manager-registration/update-registration-form', data);
    },


    // Player Registration
    playerRegister: (data) => {
        return api.post('/player-registration/player-register', data);
    },
    getAllPlayerRegistration: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/player-registration/registration-list', { params: validFilters });
    },
    approvePlayer: (id) => {
        return api.post(`/player-registration/approve/${id}`);
    },
    callPlayerTryOut: (data) => {
        return api.post(`/player-registration/call-try-out`, data);
    },
    rejectPlayer: (id) => {
        return api.post(`/api/player-registration/reject-registration-form?id=${id}`);
    },
    updatePlayerForm: (data) => {
        return api.put('/player-registration/update-player-register', data);
    },
    noteTryOut: (id, data) => {
        return api.post(`/player-registration/${id}/tryout-note`, data);
    },
    updatePlayerFormById: (id, status) => {
        return api.post(`/player-registration/update-status-form-by-id?id=${id}&status=${status}`);
    },

};

export default registerApi;