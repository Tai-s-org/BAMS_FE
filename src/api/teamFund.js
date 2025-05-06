import api from "./axios";

const teamFundApi = {
    addExpenditure: (teamFundId, data) => {
        return api.post(`/team-fund/add-expenditure-has-user-id?teamFundId=${teamFundId}`, data);
    },
    updateExpenditure: (teamFundId, data) => {
        return api.put(`/team-fund/edit-expenditure-has-user-id?teamFundId=${teamFundId}`, data);
    },
    listExpenditure: (teamFundId) => {
        return api.get(`/team-fund/list-expenditure?teamFundId=${teamFundId}`);
    },
    approveTeamFund: (teamFundId) => {
        return api.post(`/team-fund/approve-team-fund`, teamFundId);
    },
    rejectTeamFund: (data) => {
        return api.post(`/team-fund/reject-teamfund`, data);
    },
    teamFundList: (data) => {
        return api.get(`/team-fund/team-fund-list`, { params: data });
    },
    teamFundListByTeamId: (teamId, data) => {
        return api.get(`/team-fund/team-fund-list?TeamId=${teamId}`, { params: data });
    },
    teamFundById: (teamFundId, data) => {
        return api.get(`/team-fund/team-fund-list?TeamFundId=${teamFundId}`, { params: data });
    },
    generateQR: (data) => {
        return api.post(`/team-fund/generate-qr-by-paymentId`, data);
    },
    getManagerPaymentMethod: (paymentId) => {
        return api.get(`/team-fund/get-manager-payment-type-by-paymentid?payment=${paymentId}`);
    },
    updatePaymentStatus: (data) => {
        return api.put(`/team-fund/update-payment-status`, data);
    },
    deleteExpenditure: (id) => {
        return api.delete(`/team-fund/delete-expenditure?expenditureId=${id}`)
    },
    listPlayerByTeamId: (id, date) => {
        return api.get(`/team-fund/players-by-date/${id}?targetDate=${date}`)
    }
}

export default teamFundApi;