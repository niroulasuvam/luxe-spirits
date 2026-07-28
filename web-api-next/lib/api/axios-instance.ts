import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;
