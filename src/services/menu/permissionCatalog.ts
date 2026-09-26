import { axiosPrivate } from "../../libs/instance"
import type { permissionCatalogProps } from "../../models/menu/permissionCatalog"

export const permissionCatalog = async (): Promise<permissionCatalogProps> => {
  const res = await axiosPrivate.get("/menus/permissions")

  if (!res) {
    throw new Error("fail to get permission catalog")
  }

  return res.data
}
