import axios from "./axios";

// Function to handle login.
export const doLogin = (credentials) =>
  axios.post("/api/admin/auth/login", credentials);

// Function to handle logout.
export const doLogout = () =>
  axios.post('/api/admin/auth/logout');

// Function to handle registration.
export const doRegister = (userData) =>
  axios.post("/api/admin/auth/registerAdmin", userData);
