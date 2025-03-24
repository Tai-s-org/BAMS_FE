import SetNewPassword from "@/app/auth/set-new-password/page";
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
    SetNewPassword: (data) => {
        return api.post('/auth/set-new-password', data);
    },
    information: () => {
        return api.get('/auth/my-information');
    },
    test: () => {
        return api.get('/club-contact');
    },
    courtList: (data) => {
        return api.get('/court/list-court-arranged-by-status', {
            params: data, 
        });
    },
    courtDetail: (id) => {
        return api.get(`/court/${id}`);
    },
};

export default authApi;
