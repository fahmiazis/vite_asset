import { axiosPrivate } from "../../libs/instance"
import type { UpdateAssetsCategoryPayload } from "../../models/assetsCategory/update"

export const updateAssetsCategory = async (
  id: number,
  payload: UpdateAssetsCategoryPayload
) => {
  const res = await axiosPrivate.put(`/asset-categories/${id}`, payload)
  return res.data
}
