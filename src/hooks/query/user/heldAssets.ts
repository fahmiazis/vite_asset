import { useAssetList } from "../asset/list"

/** batas atas backend untuk `limit` (dto.AssetListFilter) */
const MAX_LIMIT = 100

/**
 * Aset yang sedang dipegang user (hasil serah terima, assets.assigned_user_id).
 * Tetap dibatasi cabang yang boleh dilihat peminta — admin melihat semua.
 */
export const useUserHeldAssets = (userId: string) => {
  const { data, isLoading, error } = useAssetList({
    page: 1,
    limit: MAX_LIMIT,
    assignedUserId: userId,
    enabled: !!userId,
  })

  const assets = data?.data?.data ?? []
  const total = data?.data?.total ?? 0

  return { assets, total, isLoading, error }
}
