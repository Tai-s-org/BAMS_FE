import api from "./axios";

const parentApi = {
    getParentById: (parentId) => {
        return api.get(`/parent/parent-details/${parentId}`);
    },
};

export default parentApi;