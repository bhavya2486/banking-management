import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/user`;

export const getProfile = async (userId) => {
  return await axios.get(`${API}/profile/${userId}`);
};

export const updateProfile = async (userId, profileData) => {
  return await axios.put(
    `${API}/profile/${userId}`,
    profileData
  );
};

export const getCustomers = async () => {
  return await axios.get(`${API}/customers`);
};