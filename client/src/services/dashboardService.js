import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/dashboard`;

export const getDashboardData = async (
  userId
) => {
  return await axios.get(
    `${API}/${userId}`
  );
};