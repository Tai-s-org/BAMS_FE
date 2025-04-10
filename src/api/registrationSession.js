import api from "./axios";

const registrationSessionApi = {
    getRegistrationSessions: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/member-registraion-session?IsEnable=true', { params: validFilters });
    },

    getRegistrationSessionById: (id) => {
        return api.get(`/member-registraion-session/${id}`);
    },

    updateRegistrationSession: (id, data) => {
        return api.put(`/member-registraion-session/${id}`, data);
    },
    validateEmailAndSendOtp: (memberRegistrationSessionId, data) => {
        return api.post(`/manager-registration/validate-email-and-send-otp/${memberRegistrationSessionId}`, data);
    }
};


export default registrationSessionApi;