import { axiosPrivate } from '../../libs/instance';
import type { UpdateUserRequest, UpdateUserResponse } from '../../models/users/update';

export const createUser = async (
  payload: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await axiosPrivate.post<UpdateUserResponse>(
    `/users`,
    payload
  );
  return response.data;
};