import { axiosPrivate } from "../../libs/instance";
import type { sidebarListProps } from "../../models/sidebar/list";
export const sidebarList = async (): Promise<sidebarListProps> => {
  const res = await axiosPrivate.get(`/menus/sidebar`)

  if (!res) {
    throw new Error('fail to get list sidebars')
  }

  const data = await res.data
  return data
}