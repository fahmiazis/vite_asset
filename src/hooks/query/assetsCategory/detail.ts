import { useQuery } from "@tanstack/react-query"
import { assetsCategoryDetail } from "../../../services/assetsCategory/detail"
import type { AssetsCategoryDetailProps } from "../../../models/assetsCategory/update"

export const useAssetsCategoryDetail = (id: number) =>
  useQuery<AssetsCategoryDetailProps>({
    queryKey: ["assets-category-detail", id],
    queryFn: () => assetsCategoryDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  })
