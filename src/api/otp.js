import api from "./axios";

const otpApi = {
    verifyEmailCode: (data) => {
        return api.post('/otp/verify', data);
    },
};

export default otpApi;
