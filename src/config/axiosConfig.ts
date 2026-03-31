
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = () => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {

          // const tokenDecode = decodeToken();
        
          // const refreshResponse = await instance.post("/auth/refresh-token",{role:tokenDecode?.role});
          // const newAccessToken = refreshResponse.data.accessToken;
          
          // removeToken();
          // setAccessToken(newAccessToken);
          
          const newAccessToken = await  refreshAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.log("Refresh token error");   
        //   removeToken();
          window.location.href = "/customer/login";
          return Promise.reject(refreshError);
        }
      }

      if (
        error.response?.status === 403 &&
        (error.response.data as any)?.message === "Your account is blocked"
      ) {
        // toast.error("Your account has been blocked by admin.");
        // removeToken();
        window.location.href = "/customer/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};





export const refreshAccessToken = async (): Promise<string> => {
  try {
    // const tokenDecode = decodeToken();

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
    //   { role: tokenDecode?.role },
      { withCredentials: true }
    );

    const newAccessToken = res.data.accessToken;

    // removeToken();
    // setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    // removeToken();
    throw error;
  }
};



export const authAPI =  axiosInstance()
