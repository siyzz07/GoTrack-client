import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { sessionService } from "../utils/session.service";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = () => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request interceptor to add access token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = sessionService.getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          sessionService.setToken(newAccessToken);
          
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          sessionService.removeToken();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      if (
        error.response?.status === 403 &&
        (error.response.data as any)?.message === "Your account is blocked"
      ) {
        sessionService.removeToken();
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = res.data.accessToken;
    sessionService.setToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    sessionService.removeToken();
    throw error;
  }
};

export const authAPI = axiosInstance();
export const tripAPI = axiosInstance();
