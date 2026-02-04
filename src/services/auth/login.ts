import { axiosPublic } from "../../libs/instance";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  // sesuaikan sama response BE lu
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: number;
    username: string;
    role?: string;
  };
}

export const loginService = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const response = await axiosPublic.post<LoginResponse>(
    `/auth/login`,
    payload,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  return response.data;
};