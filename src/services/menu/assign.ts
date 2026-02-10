import { axiosPrivate } from "../../libs/instance";
import type { AssignMenusRequest, AssignMenusResponse } from "../../models/menu/assignReq";


// Axios instance dengan default config
const apiClient = axiosPrivate.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // atau dari Redux/Context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const roleService = {
  assignMenusToRole: async (
    roleId: string,
    payload: AssignMenusRequest
  ): Promise<AssignMenusResponse> => {
    const response = await axiosPrivate.post<AssignMenusResponse>(
      `/roles/${roleId}/menus`,
      payload
    );
    return response.data;
  },
};