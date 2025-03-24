import api from "./axios";

const registerApi = {
    managerRegister: (data) => {
        return api.get('/manager-registration/register', data);
    },
    getAllManagerRegistration: () => {
        return api.get('/manager-registration/get-all');
    },
    approveManager: (id) => {
        return api.post(`/manager-registration/approve/${id}`);
    },
    rejectManager: (id) => {
        return api.post(`/manager-registration/reject/${id}`);
    },
    updateProfile: (data) => {
        return api.post('/my-account/update-profile', data);
    },
    resetPassword: (userId, data) => {
        return api.post(`/my-account/reset-password/${userId}`, data);
    },
};

export default registerApi;