import api from "./axios";

const scheduleApi = {
    getTrainingSessions: (data) => {
        return api.get('/training-session', {params: data});
    },

    createTrainingSession: (data) => {
        return api.post('/training-session', data);
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
    editExercise: (id, data) => {
        return api.put(`/training-session/edit-exercise/${id}`, data);
    },
    deleteExercise: (id) => {
        return api.delete(`/training-session/exercise/${id}`);
    },
};

export default scheduleApi;