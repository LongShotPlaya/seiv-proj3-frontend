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
  createStudentCourses(data) {
    return apiClient.post(`/studentCourses/mult`, data);
  },
  updateStudentCourse(studentCourseId, data) {
    return apiClient.put(`/studentCourses/${studentCourseId}`, data);
  },
  deleteStudentCourse(studentCourseId) {
    return apiClient.delete(`/studentCourses/${studentCourseId}`);
  },
  deleteStudentCourses(data) {
    return apiClient.delete(`/studentCourses/mult`, {data});
  },
  deleteAllStudentCourse() {
    return apiClient.delete(`/studentCourses`)
  }
};
