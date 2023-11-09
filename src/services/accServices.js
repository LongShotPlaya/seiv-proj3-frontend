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
  createAccomodations(data) {
    return apiClient.post(`/accomodations/mult`, data);
  },
  updateAccomodation(accomodationId, data) {
    return apiClient.put(`/accomodations/${accomodationId}`, data);
  },
  deleteAccomodation(accomodationId) {
    return apiClient.delete(`/accomodations/${accomodationId}`);
  },
  deleteAccomodations(data) {
    return apiClient.delete(`/accomodations/mult`, {data});
  },
  deleteAllAccomodations() {
    return apiClient.delete(`/accomodations`);
  }
};
