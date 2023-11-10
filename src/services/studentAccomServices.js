import apiClient from "./services.js";

export default {
  getAllStudentAccomodations() {
    return apiClient.get(`/studentAccoms`);
  },
  getStudentAccomodations(studentAccomsId) {
    return apiClient.get(`/studentAccoms/${studentAccomsId}`);
  },
  createStudentAccomodation(data) {
    return apiClient.post(`/studentAccoms`, data);
  },
  createStudentAccomodations(data) {
    return apiClient.post(`/studentAccoms`, data);
  },
  updateStudentAccomodations(studentAccomId, data) {
    return apiClient.put(`/studentAccoms/${studentAccomId}`, data);
  },
  deleteStudentAccomodation(studentAccomId) {
    return apiClient.delete(`/studentAccoms/${studentAccomId}`);
  },
  deleteStudentAccomodations(data) {
    return apiClient.delete(`/studentAccoms/mult`, data);
  },
  deleteAllStudentAccomodations() {
    return apiClient.delete(`/studentAccoms/${studentAccomsId}`);
  }
};
