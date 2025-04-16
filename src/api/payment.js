import api from "./axios";

const paymentApi = {
    getPaymentHistoryByTeam: (teamId, data) => {
        return api.get(`/payment/team-history?teamId=${teamId}`, {params: data});
    },
    getPaymentHistoryByUser: (userId, data) => {
        return api.get(`/payment/user-history?userId=${userId}`, {params: data});
    },
    getPaymentDetail: (id) => {
        return api.get(`/payment/detail/${id}`);
    }
    

}

export default paymentApi;