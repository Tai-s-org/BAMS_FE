import api from "./axios";

const registrationSessionApi = {
    getRegistrationSessions: (filters = {}) => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );

        return api.get('/member-registraion-session', { params: validFilters });
    },
};

export default registrationSessionApi;