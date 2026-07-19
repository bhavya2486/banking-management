import axios from "axios";

const API =
  "http://localhost:5000/api/dashboard";

export const getDashboardData = async (
  userId
) => {
  return await axios.get(
    `${API}/${userId}`
  );
};