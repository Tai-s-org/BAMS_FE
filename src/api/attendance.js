import api from "./axios";

const attendanceApi = {
    getPlayerAttendance: (data) => {
        return api.get('/Attendance/players-for-attendance', {params: data});
    },
    getCoachAttendance: (data) => {
        return api.get('/Attendance/coaches-for-attendance', {params: data});
    },
    getUserAttendance: (data) => {
        return api.get('/Attendance/view-attendance', {params: data});
    },
    getAttendanceByTS: (id) => {
        return api.get(`/Attendance/${id}`);
    },
    editAttendance: (attendanceId, data) => {
        return api.put(`/Attendance/${attendanceId}`, data);
    },
    takeAttendance: (data) => {
        return api.post('/Attendance/take-attendance', data);
    },
}

export default attendanceApi;