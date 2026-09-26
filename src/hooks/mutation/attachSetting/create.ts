// hooks/mutation/attachment-setting/useCreateAttachmentSetting.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createAttachmentSetting, type CreateAttachmentSettingPayload } from "../../../services/attachmentSetting/create"

export function useCreateAttachmentSetting() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: CreateAttachmentSettingPayload) =>
            createAttachmentSetting(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attachment-setting-list"] })
            // FIX: rutenya '/dashboard/setting-attachment' (lihat routers/index.tsx),
            // bukan 'attachment-setting' — redirect lama selalu mendarat di 404
            navigate("/dashboard/setting-attachment")
        },
    })
}