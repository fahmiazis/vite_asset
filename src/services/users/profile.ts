import { axiosPrivate } from "../../libs/instance"

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

/** PUT /auth/me/password — ganti password sendiri */
export const changeMyPassword = async (payload: ChangePasswordRequest) => {
  const res = await axiosPrivate.put(`/auth/me/password`, payload)
  return res.data
}

/** GET /users/:id/avatar — butuh Authorization, jadi diambil sebagai blob */
export const userAvatarBlob = async (userId: string): Promise<Blob> => {
  const res = await axiosPrivate.get(`/users/${userId}/avatar`, {
    responseType: "blob",
  })
  return res.data
}

/**
 * Upload foto profil. `self` → /auth/me/avatar (user sendiri),
 * selain itu → /users/:id/avatar (admin).
 */
export const uploadAvatar = async (userId: string, file: File, self: boolean) => {
  const form = new FormData()
  form.append("file", file)
  const url = self ? `/auth/me/avatar` : `/users/${userId}/avatar`
  const res = await axiosPrivate.post(url, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const deleteAvatar = async (userId: string, self: boolean) => {
  const url = self ? `/auth/me/avatar` : `/users/${userId}/avatar`
  const res = await axiosPrivate.delete(url)
  return res.data
}
