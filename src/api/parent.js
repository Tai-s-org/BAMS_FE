import api from "./axios";

const parentApi = {
    getParentById: (parentId) => {
        return api.get(`/parent/parent-details/${parentId}`);
    },
    addParent: (playerId, data) => {
        return api.post(`/parent/add-parent/${playerId}`, data);
    }
};

export default parentApi;