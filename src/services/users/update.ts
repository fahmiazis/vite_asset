import { axiosPrivate } from '../../libs/instance';
import type { UpdateUserRequest, UpdateUserResponse } from '../../models/users/update';

export const updateUser = async (
  userId: string,
  payload: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await axiosPrivate.put<UpdateUserResponse>(
    `/users/${userId}`,
    payload
  );
  return response.data;
};