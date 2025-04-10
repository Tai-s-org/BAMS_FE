import SetNewPassword from "@/app/auth/set-new-password/page";
import api from "./axios";

const authApi = {
    signIn: (data) => {
        return api.post('/auth/login', data);
    },
    logout: () => {
        return api.post('/auth/logout');
    },
    refreshToken: () => {
        return api.post('/auth/refresh-token');
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
    SetNewPassword: (data) => {
        return api.post('/auth/set-new-password', data);
    },
    information: () => {
        return api.get('/auth/my-information');
    },
    test: () => {
        return api.get('/club-contact');
    },
};

export default authApi;
