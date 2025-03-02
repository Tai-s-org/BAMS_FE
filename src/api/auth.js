import api from "./axios";

const authApi = {
    signIn: (data) => {
        return api.post('/auth/login', data);
    },
    logout: () => {
        return api.post('/auth/logout');
    },
    changePassword: (data) => {
        return api.post('/auth/change-password', data);
    },
    forgotPassword: (data) => {
        return api.post('/auth/forgot-password', data);
    },
    validateForgotPassword: (data) => {
        return api.post('/auth/validate-forgot-password-token', data);
    },
    changePassword: (data) => {
        return api.post('/auth/set-new-password', data);
    },
    information: () => {
        return api.get('/auth/my-information');
    },
};

export default authApi;
