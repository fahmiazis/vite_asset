import { axiosPrivate } from "../../libs/instance";
import type { allMenuProps } from "../../models/menu/list";
export const menuList = async (): Promise<allMenuProps> => {
  const res = await axiosPrivate.get(`/api/v1/menus`)

  if (!res) {
    throw new Error('fail to get list menus')
  }

  const data = await res.data
  return data
}