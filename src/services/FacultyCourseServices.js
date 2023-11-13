import apiClient from "./services.js";

export default {
  getAllFacultyCourses() {
    return apiClient.get(`/facultyCourses`);
  },
  getFacultyCourse(facultyCourseId) {
    return apiClient.get(`/facultyCourses/${facultyCourseId}`);
  },
  createFacultyCourse(data) {
    return apiClient.post(`/facultyCourses`, data);
  },
  createFacultyCourses(data) {
    return apiClient.post(`/facultyCourses/mult`, data);
  },
  updateFacultyCourse(facultyCourseId, data) {
    return apiClient.put(`/facultyCourses/${facultyCourseId}`, data);
  },
  deleteFacultyCourse(facultyCourseId) {
    return apiClient.delete(`/facultyCourses/${facultyCourseId}`);
  },
  deleteFacultyCourses(data) {
    return apiClient.delete(`/facultyCourses/mult`, {data});
  },
  deleteAllFacultyCourses() {
    return apiClient.delete(`/facultyCourses`);
  },
};
