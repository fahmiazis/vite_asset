import { axiosPrivate } from "../../libs/instance"
import type { roleMenusProps } from "../../models/roles/roleMenus"

/** GET /roles/:id/menus — menu + permissions yang sudah dimiliki role */
export const roleMenus = async (roleId: string): Promise<roleMenusProps> => {
  const res = await axiosPrivate.get(`/roles/${roleId}/menus`)

  if (!res) {
    throw new Error("fail to get role menus")
  }

  return res.data
}
