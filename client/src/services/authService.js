import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const registerUser = async (userData) => {
  return await axios.post(`${API}/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API}/login`, userData);
};

export const registerCustomer = async (customerData) => {
  return await axios.post(`${API}/register-customer`, customerData);
};