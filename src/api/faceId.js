import api from "./axios"

const faceIdApi = {
    registerFaceId: (data) => {
        return api.post("/face-recognition/register", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    },
    getFaceId: (data) => {
        return api.get("/face-recognition/registered-faces", { params: data })
    },
    deleteFaceId: (id) => {
        return api.delete(`/face-recognition/delete/${id}`)
    }

}

export default faceIdApi