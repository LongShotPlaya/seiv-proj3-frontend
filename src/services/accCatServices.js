import apiClient from "./services.js";

export default {
  getAllAccomodationCats() {
    return apiClient.get(`/accomodationCats`);
  },
  getAccomodationCat(accomodationCatId) {
    return apiClient.get(`/accomodationCats/${accomodationCatId}`);
  },
  createAccomodationCat(data) {
    return apiClient.post(`/accomodationCats`, data);
  },
  updateAccomodationCat(accomodationCatId, data) {
    return apiClient.put(`/accomodationCats/${accomodationCatId}`, data);
  },
  deleteAccomodationCat(AccomodationCatId) {
    return apiClient.delete(`/accomodationCats/${AccomodationCatId}`);
  },
  deleteAllAccomodationCat() {
    return apiClient.delete(`/accomodationCats`)
  },
};
