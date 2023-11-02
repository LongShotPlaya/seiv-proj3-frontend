import apiClient from "./services.js";

export default {
  getAllStudents() {
    return apiClient.get(`/students`);
  },
  getStudent(studentId) {
    return apiClient.get(`/students/${studentId}`);
  },
  getStudentRequests(studentId) {
    return apiClient.get(`/students/${studentId}/requests`);
  },
  getStudentAccommodations(studentId) {
    return apiClient.get(`/students/${studentId}/accommodations`);
  },
  getStudentCourses(studentId) {
    return apiClient.get(`/students/${studentId}/courses`);
  },
  createStudent(data) {
    return apiClient.post(`/students`, data);
  },
  updateStudent(studentId, data) {
    return apiClient.put(`/students/${studentId}`, data);
  },
  deleteStudent(studentId) {
    return apiClient.delete(`/students/${studentId}`);
  },
  deleteAllStudents() {
    return apiClient.delete(`/students`)
  }
};
