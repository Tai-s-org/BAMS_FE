import api from "./axios";

const scheduleApi = {
    getTrainingSessions: (data) => {
        return api.get('/training-session', {params: data});
    },

    createTrainingSession: (data) => {
        return api.post('/training-session/create-additional', data);
    },
    getTrainingSessionById: (id) => {
        return api.get(`/training-session/${id}`);
    },
    updateTrainingSession: (id, data) => {
        return api.put(`/training-session/${id}`, data);
    },
    cancelTrainingSession: (id) => {
        return api.post(`/training-session/${id}/cancel`);
    },
    createExercise: (data) => {
        return api.post('/training-session/add-exercise', data);
    },
    editExercise: (data) => {
        return api.put(`/training-session/edit-exercise`, data);
    },
    deleteExercise: (id) => {
        return api.delete(`/training-session/${id}`);
    },
    createTrainingSessionAutomation: (data) => {
        return api.post('/training-session/generate', data);
    },
    createTrainingSessionBulk: (data) => {
        return api.post('/training-session/bulk-create', data);
    },
    checkSessionConflict: (data) => {
        return api.get(`/training-session/check-conflict`, {params: data});
    }
};

export default scheduleApi;