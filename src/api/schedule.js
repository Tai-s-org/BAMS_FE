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
    updateTrainingSession: (data) => {
        return api.put(`/training-session/update`, data);
    },
    cancelTrainingSession: (data) => {
        return api.post(`/training-session/cancel`, data);
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
    },
    getPendingTrainingSession: () => {
        return api.get('/training-session/pending');
    },
    approvePendingTrainingSession: (id) => {
        return api.post(`/training-session/${id}/approve`);
    },
    rejectPendingTrainingSession: (data) => {
        return api.post(`/training-session/reject`, data);
    },
    getUpdatePendingTrainingSession: () => {
        return api.get(`/training-session/update-request`);
    },
    approveUpdatePendingTrainingSession: (data) => {
        return api.post(`/training-session/update/approve`, data);
    },
    rejectUpdatePendingTrainingSession: (data) => {
        return api.post(`training-session/update/reject`, data);
    },
    getCancelPendingTrainingSession: () => {
        return api.get(`/training-session/cancel-request`);
    },
    approveCancelPendingTrainingSession: (id) => {
        return api.post(`/training-session/${id}/cancel/approve`);
    },
    rejectCancelPendingTrainingSession: (data) => {
        return api.post(`/training-session/cancel/reject`, data);
    }
};

export default scheduleApi;