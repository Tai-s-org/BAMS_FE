import api from "./axios";

const tryOutApi = {
    getMeasurementScale: () => {
        return api.get('/try-out-score/measurement-scale');
    },

    getMeasurementScaleDetail: (measurementScaleCode) => {
        return api.get(`/try-out-score/measurement-scale/${measurementScaleCode}`);
    },

    getMeasurementScaleLeaf: () => {
        return api.get('/try-out-score/measurement-scale/leaf');
    },

    addSinglePlayerScore: (data) => {
        return api.post(`/try-out-score/add-single-player-scores`, data);
    },

    getPlayerScore: (playerRegistrationId) => {
        return api.get(`/try-out-score/player/score/${playerRegistrationId}`);
    },  

    getPlayerScoreByReport: (playerRegistrationId) => {
        return api.get(`/try-out-score/player/report/${playerRegistrationId}`);
    },
    
};

export default tryOutApi;
