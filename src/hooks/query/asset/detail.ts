import { useQuery } from "@tanstack/react-query";
import type { detailAssetsProps } from "../../../models/asset/detail";
import { assetDetail } from "../../../services/asset/detail";

export const useAssetDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailAssetsProps>({
    queryKey: ["asset-detail", id],
    queryFn: () => assetDetail(id),
  });

  return { data, isLoading, error, refetch };
};
