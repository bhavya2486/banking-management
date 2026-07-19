import axios from "axios";

const API = "http://localhost:5000/api/transactions";

export const transferFunds = async (transferData) => {
  return await axios.post(`${API}/transfer`, transferData);
};
export const getTransactions = async (userId) => {
  return await axios.get(`${API}/${userId}`);
};

export const getAllTransactions = async (params = {}) => {
  return await axios.get(`${API}/admin/all`, { params });
};
