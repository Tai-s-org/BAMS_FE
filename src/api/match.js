import api from "./axios";

const matchApi = {
    getMatch: (data) => {
        return api.get('/match', {params: data});
    },
    getMatchById: (id) => {
        return api.get(`/match/${id}`);
    },
    createMatch: (data) => {
        return api.post('/match', data);
    },
    updateMatch: (id, data) => {
        return api.put(`/match/${id}`, data);
    },
    getAvailableCourts: (data) => {
        return api.get('/match/available-courts', {params: data});
    },
    cancelMatch: (id) => {
        return api.post(`/match/cancel/${id}`);
    },
    callPlayer: (data) => {
        return api.post(`/match/call-player`, data);
    },
    getAvailablePlayers: (matchId) => {
        return api.get(`/match/${matchId}/available-players`);
    },
    removePlayer: (id, playerId) => {
        return api.delete(`/match/${id}/player/${playerId}`);
    },
    removeArticle: (id, articleId) => {
        return api.delete(`/match/${id}/article/${articleId}`);
    },
    createArticle: (matchId, data) => {
        return api.post(`/match/${matchId}/articles`, data);
    },
    uploadArticleFile: (id, data) => {
        return api.post(`/match/${id}/upload-article-file`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteArticleFile: (filePath) => {
        return api.delete(`/match/delete-article-file`, {params: {filePath}});
    },
    deleteArticle: (matchId, articleId) => {
        return api.delete(`/match/${matchId}/article/${articleId}`);
    }
};

export default matchApi;