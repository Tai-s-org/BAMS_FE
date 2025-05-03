import api from "./axios";

const parentApi = {
    getParentById: (parentId) => {
        return api.get(`/parent/parent-details/${parentId}`);
    },
    addParent: (playerId, data) => {
        return api.post(`/parent/assign-parent/${playerId}`, data);
    },
    getParentList: (filter) => {
        return api.get(`/parent/filter-parents`, { params: filter });
    },
    createParent: (data) => {
        return api.post(`/parent/create-and-assign-parent-to-player`, data);
    },
};

export default parentApi;