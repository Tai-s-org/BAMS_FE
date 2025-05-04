import api from "./axios";

const playerApi = {
    getNonTeamPlayers: (filter) => {
        return api.get("/player/player-list", { params: filter });
    },
    disablePlayer: (id) => {
        return api.put(`/player/disable/${id}`);
    },
    removeParent: (id) => {
        return api.put(`/player/${id}/remove-parent`);
    },
    addToTeam: (teamId, data) => {
        return api.post(`/player/assign-team/${teamId}`, data);
    },
    getAllPlayerWithTeam: (filter) => {
        return api.get("/player/player-list", { params: filter });
    },
    getNonTeamPlayersByGender: (filter) => {
        return api.get("/player/players-to-assign-to-team", { params: filter });
    },
};

export default playerApi;