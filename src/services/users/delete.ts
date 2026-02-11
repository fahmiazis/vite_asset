import { axiosPrivate } from "../../libs/instance";
import type { DeleteUserResponse } from "../../models/users/delete";


export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  const response = await axiosPrivate.delete<DeleteUserResponse>(`/users/${userId}`);
  return response.data;
};