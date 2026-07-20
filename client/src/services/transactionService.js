import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/transactions`;

export const transferFunds = async (transferData) => {
  return await axios.post(`${API}/transfer`, transferData);
};
export const getTransactions = async (userId) => {
  return await axios.get(`${API}/${userId}`);
};

export const getAllTransactions = async (params = {}) => {
  return await axios.get(`${API}/admin/all`, { params });
};
