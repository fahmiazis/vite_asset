import { axiosPrivate } from "../../libs/instance";
import type { assetsCategoryListProps } from "../../models/assetsCategory/list";
export const assetsCategoryList = async (): Promise<assetsCategoryListProps> => {
  const res = await axiosPrivate.get(`/asset-categories`)

  if (!res) {
    throw new Error('fail to get list assets category')
  }

  const data = await res.data
  return data
}