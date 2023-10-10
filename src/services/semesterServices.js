import { semester } from "../../../../seiv-proj3-backend/app/models/index.js";
import apiClient from "./services.js";

export default {
  getAllSemesters() {
    return apiClient.get(`/semesters`);
  },
  getSemester(semesterId) {
    return apiClient.get(`/semesters/${semesterId}`);
  },
  createSemester(data) {
    return apiClient.post(`/semesters`, data);
  },
  updateSemester(semesterId, data) {
    return apiClient.put(`/semesters/${semesterId}`, data);
  },
  deleteSemester(semesterId) {
    return apiClient.delete(`/semesters/${semesterId}`);
  },
  getCoursesForSemester(semesterId) {
    return apiClient.get(`/semesters/${semesterId}/schedules`);
  },
  getRequestsForSemester(semesterId) {
    return apiClient.get(`/semesters/${semesterId}/requests`);
  }
};
