/**
 * Mirror dto.CreateUserRequest (backend-go/dto/user_dto.go).
 *
 * Berbeda dengan update, semua field di bawah WAJIB — termasuk `role_ids`
 * yang di backend ber-binding `required,min=1`. Halaman create sebelumnya
 * memakai UpdateUserRequest dan tidak pernah mengirim role, jadi request-nya
 * selalu ditolak validasi.
 */
export interface CreateUserRequest {
  username: string
  fullname: string
  email: string
  password: string
  /** satu role saja — dikirim sebagai array karena backend menerima array */
  role_ids: string[]
  nik?: string
  mpn_number?: string
  status?: "active" | "inactive"
}

export interface CreateUserResponse {
  message: string
  data?: any
}
