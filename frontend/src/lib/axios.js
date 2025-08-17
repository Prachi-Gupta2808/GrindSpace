import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://grindspace-kd1g.onrender.com/api", // deployed backend
  withCredentials: true, // to send cookies for authentication
});
