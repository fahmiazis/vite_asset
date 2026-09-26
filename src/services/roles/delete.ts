import { axiosPrivate } from "../../libs/instance"

export const deleteRole = async (id: string) => {
  const res = await axiosPrivate.delete(`/roles/${id}`)

  if (!res) {
    throw new Error("fail to delete role")
  }

  return res.data
}
