import apiClient from "./services.js";

export default {
  getAllStudentCourse() {
    return apiClient.get(`/studentCourses`);
  },
  getStudentCourse(studentCourseId) {
    return apiClient.get(`/studentCourses/${studentCourseId}`);
  },
  createStudentCourse(data) {
    return apiClient.post(`/studentCourses`, data);
  },
  updateStudentCourse(studentCourseId, data) {
    return apiClient.put(`/studentCourses/${studentCourseId}`, data);
  },
  deleteStudentCourse(studentCourseId) {
    return apiClient.delete(`/studentCourses/${studentCourseId}`);
  },
  deleteAllStudentCourse() {
    return apiClient.delete(`/studentCourses`)
  }
};
