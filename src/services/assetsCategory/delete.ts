import { axiosPrivate } from "../../libs/instance"

export const deleteAssetsCategory = async (id: number) => {
  const res = await axiosPrivate.delete(`/asset-categories/${id}`)
  return res.data
}
