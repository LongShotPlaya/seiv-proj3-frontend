import apiClient from "./services.js";

export default {
  getAllUsers() {
    return apiClient.get(`/user`);
  },
  getUser(userId) {
    return apiClient.get(`/user/${userId}`);
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
  }
};
