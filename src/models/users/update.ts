export interface UpdateUserRequest {
  username?: string;
  fullname?: string;
  email?: string;
  password?: string; 
}

export interface UpdateUserResponse {
  message: string;
  data?: any;
}