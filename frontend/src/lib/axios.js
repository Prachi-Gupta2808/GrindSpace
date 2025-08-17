import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "https://grindspace-kd1g.onrender.com/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // to send cookies with the request
});