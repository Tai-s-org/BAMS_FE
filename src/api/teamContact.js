import api from "./axios";

const teamContactApi = {
    getClubContct: () => {
        return api.get('/club-contact');
    },
    updateClubContact: (data) => {
        return api.get(`/club-contact/edit`, data);
    },
    
}

export default teamContactApi;