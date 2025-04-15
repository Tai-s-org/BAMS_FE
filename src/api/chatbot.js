import api from "./axios";

const chatbotApi = {
    sendMessage: (data) => {
        return api.post('/chatbot/guest', data);
    },
};

export default chatbotApi;