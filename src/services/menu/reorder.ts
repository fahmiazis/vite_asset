import { axiosPrivate } from "../../libs/instance"
import type { ReorderMenusRequest } from "../../models/menu/reorder"

/** PUT /menus/reorder — simpan urutan (dan parent) banyak menu dalam satu transaksi */
export const reorderMenus = async (payload: ReorderMenusRequest) => {
  const res = await axiosPrivate.put("/menus/reorder", payload)

  if (!res) {
    throw new Error("fail to reorder menus")
  }

  return res.data
}
