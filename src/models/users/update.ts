/**
 * Mirror dto.UpdateUserRequest (backend-go/dto/user_dto.go).
 *
 * PENTING: `username` TIDAK ADA di DTO backend — UpdateUser hanya memproses
 * fullname, email, password, nik, mpn_number, dan status. Kalau username ikut
 * dikirim, backend mengabaikannya diam-diam dan user mengira username-nya
 * sudah berubah. Karena itu field-nya tidak disediakan di sini.
 */
export interface UpdateUserRequest {
  fullname?: string;
  email?: string;
  password?: string;
  nik?: string;
  mpn_number?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateUserResponse {
  message: string;
  data?: any;
}
