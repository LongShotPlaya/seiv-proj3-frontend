import apiClient from "./services.js";

export default {
  getAllRequests() {
    return apiClient.get(`/requests`);
  },
  getRequest(requestId) {
    return apiClient.get(`/requests/${requestId}`);
  },
  createRequest(data) {
    return apiClient.post(`/requests`, data);
  },
  updateRequest(requestId, data) {
    return apiClient.put(`/requests/${requestId}`, data);
  },
  deleteRequest(requestId) {
    return apiClient.delete(`/requests/${requestId}`);
  },
  deleteAllRequests() {
    return apiClient.delete(`/requests`);
  }
};
