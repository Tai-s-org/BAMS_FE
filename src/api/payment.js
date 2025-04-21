import api from "./axios";

const paymentApi = {
    getPaymentHistoryByTeam: (teamId, data) => {
        return api.get(`/payment-management/team?teamId=${teamId}`, {params: data});
    },
    getMyPaymentHistory: (data) => {
        return api.get(`/payment-management/my-payment`, {params: data});
    },
    getPaymentDetail: (id) => {
        return api.get(`/payment-management/payment-detail?PaymentId=${id}`);
    }
    

}

export default paymentApi;