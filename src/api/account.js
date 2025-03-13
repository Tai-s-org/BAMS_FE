import api from "./axios";

const accountApi = {
    getProfile: () => {
        return api.get('/my-account/update-profile');
    },
    updateProfile: (data) => {
        return api.post('/my-account/update-profile', data);
    },
    resetPassword: (userId, data) => {
        return api.post(`/my-account/reset-password/${userId}`, data);
    },
};

export default accountApi;
