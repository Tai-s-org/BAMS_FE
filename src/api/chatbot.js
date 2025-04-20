import api from "./axios";

const chatbotApi = {
    sendMessage: (data) => {
        return api.post('/chatbot/guest', data);
    },
    getDocuments: (data) => {
        return api.get('/chatbot/chatbot-document-contents', {params: data});
    },
    uploadDocument: (filter, formData) => {
        return api.post('/chatbot/update-chatbot-document', formData, {
          params: filter,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
};

export default chatbotApi;