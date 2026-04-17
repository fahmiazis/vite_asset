import { useQuery } from "@tanstack/react-query";
import type { attchSettingDetailProps } from "../../../models/attachmentSetting/detail";
import { attachSettingDetail } from "../../../services/attachmentSetting/detail";

export const useAttachSettingDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<attchSettingDetailProps>({
    queryKey: ["attach-setting-detail", id],
    queryFn: () => attachSettingDetail(id),
  });

  return { data, isLoading, error, refetch };
};
