import { axiosPrivate } from "../../libs/instance"
import type { AssetsCategoryDetailProps } from "../../models/assetsCategory/update"

export const assetsCategoryDetail = async (
  id: number
): Promise<AssetsCategoryDetailProps> => {
  const res = await axiosPrivate.get(`/asset-categories/${id}`)
  return res.data
}
