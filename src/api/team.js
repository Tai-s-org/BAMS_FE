import api from "./axios";

const teamApi = {
    listTeams: (data) => {
        return api.get('/team', {params: data});
    },
    teamDetail: (id) => {
        return api.get(`/team/${id}`);
    },
    updateTeamName: (data, id) => {
        return api.put(`/team/${id}`, data);
    },
    updateTeamStatus: (id) => {
        return api.delete(`/team/teams/${id}`);
    },
    createTeam: (data) => {
        return api.post('/team/create', data);
    },
    dissolveTeam: (id, note) => {
        return api.delete(`/team/disband/${id}`, {params: note});
    },
    removePlayer: (teamId, data, query) => {
        return api.post(`/team/remove/${teamId}/players`, data, {params: query});
    },
    removeCoach: (teamId, data, query) => {
        return api.post(`/team/remove/${teamId}/coaches`, data, {params: query});
    },
    removeManager: (teamId, data, query) => {
        return api.post(`/team/remove/${teamId}/managers`, data, {params: query});
    },
    updateFundManager: (teamId, managerId) => {
        return api.put(`/team/${teamId}/update-fund-manager/${managerId}`);
    }
}

export default teamApi;