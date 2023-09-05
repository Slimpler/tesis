import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config";


const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((request) => {
  const token = Cookies.get("token");
  if (token) {
    request.headers.Authorization = `${token}`;
  }

  return request;
});

export default instance;
