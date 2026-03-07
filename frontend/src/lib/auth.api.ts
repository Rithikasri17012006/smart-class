import { api } from "./api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
};