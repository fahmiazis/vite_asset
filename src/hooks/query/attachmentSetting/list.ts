import { useQuery } from "@tanstack/react-query";
import type { attachmentSettingProps } from "../../../models/attachmentSetting/list";
import { AttachmentSettingList } from "../../../services/attachmentSetting/list";

export const useAttachmentSettingList = (type: string) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<attachmentSettingProps>({
        queryKey: ["attachment-setting-list", type],
        queryFn: () => AttachmentSettingList(type),
    });

    return { data, isLoading, error, refetch };
};
