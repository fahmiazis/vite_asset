import { axiosPrivate } from "../../libs/instance"
import type {
  permissionCatalogProps,
  SetMenuPermissionsRequest,
} from "../../models/menu/permissionCatalog"

/** PUT /menus/:id/permissions — atur hak akses mana yang relevan untuk satu menu */
export const setMenuPermissions = async (
  menuId: string,
  payload: SetMenuPermissionsRequest
): Promise<permissionCatalogProps> => {
  const res = await axiosPrivate.put(`/menus/${menuId}/permissions`, payload)

  if (!res) {
    throw new Error("fail to set menu permissions")
  }

  return res.data
}
