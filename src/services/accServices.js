import apiClient from "./services.js";

export default {
  getAllAccomodations() {
    return apiClient.get(`/accomodations`);
  },
  getAccomodation(accomodationId) {
    return apiClient.get(`/accomodations/${accomodationId}`);
  },
  createAccomodation(data) {
    return apiClient.post(`/accomodations`, data);
  },
  updateAccomodation(accomodationId, data) {
    return apiClient.put(`/accomodations/${accomodationId}`, data);
  },
  deleteAccomodation(accomodationId) {
    return apiClient.delete(`/accomodations/${accomodationId}`);
  },
  deleteAllAccomodations() {
    return apiClient.delete(`/accomodations`);
  }
};
