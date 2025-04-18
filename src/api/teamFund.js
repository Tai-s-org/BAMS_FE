import api from "./axios";

const teamFundApi = {
    addExpenditure: (teamFundId, data) => {
        return api.post(`/team-fund/add-expenditure?teamFundId=${teamFundId}`, data);
    },
    updateExpenditure: (teamFundId, data) => {
        return api.post(`/team-fund/edit-expenditure?teamFundId=${teamFundId}`, data);
    },
    listExpenditure: (teamFundId) => {
        return api.get(`/team-fund/list-expenditure?teamFundId=${teamFundId}`);
    },
    approveTeamFund: (teamFundId) => {
        return api.post(`/team-fund/approve-team-fund`, teamFundId);
    },
    teamFundList: (data) => {
        return api.get(`/team-fund/team-fund-list`, {params: data});
    },
    generateQR: (data) => {
        return api.post(`/team-fund/generate-qr-by-paymentId`, data);
    },


}

export default teamFundApi;