import { course } from "../../../../seiv-proj3-backend/app/models/index.js";
import apiClient from "./services.js";

export default {
  getAllCourses() {
    return apiClient.get(`/courses`);
  },
  getCourse(courseId) {
    return apiClient.get(`/courses/${courseId}`);
  },
  createCourse(data) {
    return apiClient.post(`/course`, data);
  },
  updateCourse(courseId, data) {
    return apiClient.put(`/courses/${courseId}`, data);
  },
  deleteCourse(courseId) {
    return apiClient.delete(`/courses/${courseId}`);
  },
  deleteAllCourses() {
    return apiClient.delete(`/courses`)
  },
};
