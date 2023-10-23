import apiClient from "./services.js";

export default {
  getAllNotifications() {
    return apiClient.get(`/notifications`);
  },
  getNotification(notificationId) {
    return apiClient.get(`/notifications/${notificationId}`);
  },
  createNotification(data) {
    return apiClient.post(`/notifications`, data);
  },
  updateNotification(notificationId, data) {
    return apiClient.put(`/notifications/${notificationId}`, data);
  },
  deleteNotification(notificationId) {
    return apiClient.delete(`/notifications/${notificationId}`);
  },
  deleteAllNotifications() {
    return apiClient.delete(`/notifications`);
  },
};
