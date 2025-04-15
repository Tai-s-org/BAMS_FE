import api from "./axios";

const courtApi = {
    courtList: (data) => {
        return api.get('/court/list-court-arranged-by-status', {
            params: data, 
        });
    },
    courtDetail: (id) => {
        return api.get(`/court/${id}`);
    },
    createCourt: (data) => {
        return api.post('court/add-new-court', data);
    },
    updateCourt: (data) => {
        return api.put(`/court/update`, data);
    },
    uploadImage: (data) => {
        return api.post('/court/upload-image-and-get-url', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteCourt: (id) => {
        return api.put(`/court/disable/${id}`);
    },
    getAvailableCourt: (data) => {
        return api.get('/training-session/available-courts', {
            params: data,
        });
    }
};

export default courtApi;
