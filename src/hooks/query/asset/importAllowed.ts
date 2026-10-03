import { useQuery } from "@tanstack/react-query"
import { assetImportAllowed } from "../../../services/masterImport/import"

/**
 * Hak akses import_asset ada di menu bertipe permission ("Asset Upload"),
 * yang tidak ikut dikirim sidebar — sama dengan useRunDepreciationAllowed.
 * Hanya untuk menyembunyikan tombol; pemeriksaan sebenarnya tetap
 * RequirePermission di POST /assets/import.
 */
export const useAssetImportAllowed = () => {
  const { data } = useQuery({
    queryKey: ["asset-import-allowed"],
    queryFn: assetImportAllowed,
    staleTime: 1000 * 60 * 5,
  })

  return data ?? false
}
