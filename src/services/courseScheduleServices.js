import { courseSchedules } from "../../../../seiv-proj3-backend/app/models/index.js";
import apiClient from "./services.js";

export default {
  getAllCourseSchedules() {
    return apiClient.get(`/courseSchedules`);
  },
  getCourseSchedule(courseScheduleId) {
    return apiClient.get(`/courseSchedules/${courseScheduleId}`);
  },
  createCourseSchedule(data) {
    return apiClient.post(`/courseSchedules`, data);
  },
  updateCourseSchedule(courseScheduleId, data) {
    return apiClient.put(`/courseSchedules/${courseScheduleId}`, data);
  },
  deleteCourseSchedule(courseScheduleId) {
    return apiClient.delete(`/courseSchedules/${courseScheduleId}`);
  },
  deleteAllCourseSchedules() {
    return apiClient.delete(`/courseSchedules`)
  },
};
