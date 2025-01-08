import axios from "./axios";
import { getHeaders, uploadHeaders } from "./axios";

// ========== DOCTORS =========== //
export const addDoctor = (data) =>
  axios.post("/api/admin/dataManager/doctor", data, getHeaders());

export const getDoctor = (page, query) =>
  axios.get(`/api/admin/dataManager/doctor/${page}?page=${page}&query=${query}`, getHeaders());

export const editDoctor = (id, data) =>
  axios.put(`/api/admin/dataManager/editDoctor/${id}`, data, getHeaders());

export const deleteDoctor = (id) =>
  axios.delete(`/api/admin/dataManager/doctor/${id}`, getHeaders());
