import apiClient from "./services.js";

export default {
  getAllStudentAccomodations() {
    return apiClient.get(`/studentAccoms`);
  },
  getStudentAccomodations(studentAccomsId) {
    return apiClient.get(`/studentAccoms/${studentAccomsId}`);
  },
  createStudentAccomodations(data) {
    return apiClient.post(`/studentAccoms`, data);
  },
  updateStudentAccomodations(studentAccomsId, data) {
    return apiClient.put(`/studentAccoms/${studentAccomsId}`, data);
  },
  deleteStudentAccomodations(studentAccomsId) {
    return apiClient.delete(`/studentAccoms/${studentAccomsId}`);
  },
  deleteAllStudentAccomodations() {
    return apiClient.delete(`/studentAccoms/${studentAccomsId}`);
  }
};
