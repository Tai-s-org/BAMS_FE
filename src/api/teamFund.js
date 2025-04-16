import api from "./axios";

const teamFundApi = {
    getMatch: (data) => {
        return api.get('/match', {params: data});
    },

}

export default teamFundApi;