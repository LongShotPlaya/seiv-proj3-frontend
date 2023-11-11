import apiClient from "./services.js";

export default {
  getAllCourseSchedules() {
    return apiClient.get(`/courseSchedules`);
  },
  getCourseSchedule(courseScheduleId) {
    return apiClient.get(`/courseSchedules/${courseScheduleId}`);
  },
  getFacultyCourseForCourseSchedule(courseScheduleId) {
    return apiClient.get(`/courseSchedules/${courseScheduleId}/faculty`);
  },
  getStudentCourseForCourseSchedule(courseScheduleId) {
    return apiClient.get(`/courseSchedules/${courseScheduleId}/students`);
  },
  createCourseSchedule(data) {
    return apiClient.post(`/courseSchedules`, data);
  },
  createCourseSchedules(data) {
    return apiClient.post(`/courseSchedules/mult`, data);
  },
  updateCourseSchedule(courseScheduleId, data) {
    return apiClient.put(`/courseSchedules/${courseScheduleId}`, data);
  },
  deleteCourseSchedule(courseScheduleId) {
    return apiClient.delete(`/courseSchedules/${courseScheduleId}`);
  },
  deleteCourseSchedules(data) {
    return apiClient.delete(`/courseSchedules/mult`, {data});
  },
  deleteAllCourseSchedules() {
    return apiClient.delete(`/courseSchedules`)
  },
};
