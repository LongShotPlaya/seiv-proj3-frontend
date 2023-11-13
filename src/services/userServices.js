import apiClient from "./services.js";

export default {
  getAllUsers() {
    return apiClient.get(`/user`);
  },
  getUser(userId) {
    return apiClient.get(`/user/${userId}`);
  },
  getProfessors(userId, semesterId) {
    return apiClient.get(`/user/${userId}/semesters/${semesterId}/faculty`);
  },
  getStudents(userId, semesterId) {
    return apiClient.get(`/user/${userId}/semesters/${semesterId}/students`);
  },
  getUserRequests(userId) {
    return apiClient.get(`/user/${userId}/requests`);
  },
  createUser(data) {
    return apiClient.post(`/user`, data);
  },
  updateUser(userId, data) {
    return apiClient.put(`/user/${userId}`, data);
  },
  updateUserRoles(data) {
    return apiClient.put(`/user`, data);
  },
  deleteUser(userId) {
    return apiClient.delete(`/user/${userId}`);
  },
  deleteAllUsers() {
    return apiClient.delete(`/user`);
  },
  sendMail(data) {
    return apiClient.post(`/user/mail`, data);
  },
};
