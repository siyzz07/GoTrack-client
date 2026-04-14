import { authAPI } from "../../config/axiosConfig";

export const signupApi = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const respons = await authAPI.post("/auth/signup", data);
  return respons;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await authAPI.post("/auth/login", data);
  return response;
};

export const logoutApi = async () => {
    const response = await authAPI.post("/auth/logout");
    return response;
};

