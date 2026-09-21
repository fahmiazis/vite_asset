import { axiosPrivate } from '../../libs/instance';
import type { CreateUserRequest, CreateUserResponse } from '../../models/users/create';

export const createUser = async (
  payload: CreateUserRequest
): Promise<CreateUserResponse> => {
  const response = await axiosPrivate.post<CreateUserResponse>(
    `/users`,
    payload
  );
  return response.data;
};
