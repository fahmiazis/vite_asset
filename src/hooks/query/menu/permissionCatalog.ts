import { useQuery } from "@tanstack/react-query"
import type { permissionCatalogProps } from "../../../models/menu/permissionCatalog"
import { permissionCatalog } from "../../../services/menu/permissionCatalog"

export const usePermissionCatalog = () => {
  const { data, isLoading, error } = useQuery<permissionCatalogProps>({
    queryKey: ["permission-catalog"],
    queryFn: permissionCatalog,
    // katalog permission jarang berubah
    staleTime: 1000 * 60 * 30,
  })

  return { data, isLoading, error }
}
