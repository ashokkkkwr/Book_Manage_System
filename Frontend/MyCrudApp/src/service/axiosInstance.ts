import axios, { type AxiosInstance } from "axios";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = localStorage.getItem("token");
  console.log("🚀 ~ axiosInstance.interceptors.request.use ~ token:", token)
  config.headers.Authorization = `${token}`;
  return config;
});
export default axiosInstance;
 