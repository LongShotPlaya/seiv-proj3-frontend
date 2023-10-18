import apiClient from "./services.js";

export default {
  getAllFaculty() {
    return apiClient.get(`/faculty`);
  },
  getFaculty(facultyId) {
    return apiClient.get(`/faculty/${facultyId}`);
  },
  getAllCoursesForFaculty (facultyId) {
    return apiClient.get(`/faculty/${facultyId}/courses`);
  },
  createFaculty(data) {
    return apiClient.post(`/faculty`, data);
  },
  updateFaculty(facultyId, data) {
    return apiClient.put(`/faculty/${facultyId}`, data);
  },
  deleteFaculty(facultyId) {
    return apiClient.delete(`/faculty/${facultyId}`);
  },
  deleteAllFaculty() {
    return apiClient.delete(`/faculty`);
  },
};
