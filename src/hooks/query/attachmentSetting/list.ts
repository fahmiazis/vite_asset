import { useQuery } from "@tanstack/react-query";
import type { attachmentSettingProps } from "../../../models/attachmentSetting/list";
import { AttachmentSettingList } from "../../../services/attachmentSetting/list";

export const useAttachmentSettingList = (type: string, stage?: string) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<attachmentSettingProps>({
        queryKey: ["attachment-setting-list", type, stage],
        queryFn: () => AttachmentSettingList(type, stage),
    });

    return { data, isLoading, error, refetch };
};
