import apiClient from "./services.js";

export default {
  getAllAccomodationsCat() {
    return apiClient.get(`/accomodationCats`);
  },
  getAccomodationCat(accomodationCatId) {
    return apiClient.get(`/accomodations/${accomodationCatId}`);
  },
  createAccomodationCat(data) {
    return apiClient.post(`/accomodations`, data);
  },
  updateAccomodationCat(accomodationCatId, data) {
    return apiClient.put(`/accomodations/${accomodationCatId}`, data);
  },
  deleteAccomodationCat(AccomodationCatId) {
    return apiClient.delete(`/accomodations/${AccomodationCatId}`);
  },
  deleteAllAccomodationCat() {
    return apiClient.delete(`/accomodations`)
  },
};
