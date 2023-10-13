import { user } from "../../../../seiv-proj3-backend/app/models/index.js";
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
  deleteUser(userId) {
    return apiClient.delete(`/user/${userId}`);
  },
  deleteAllUsers() {
    return apiClient.delete(`/user`);
  }
};
