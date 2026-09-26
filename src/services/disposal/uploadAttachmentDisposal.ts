import { axiosPrivate } from "../../libs/instance";

export interface UploadDisposalAttachmentResponse {
    data: any
    message: string
    status: string
}

export interface UploadDisposalAttachmentParams {
    transaction_number: string
}

export interface UploadDisposalAttachmentPayload {
    /** ID baris transaction_disposal_assets (asset.id pada response detail), BUKAN asset_id */
    transaction_disposal_asset_id: string
    attachment_config_id: string
    stage: string
    file: File
}

export const uploadDisposalAttachment = async (
    params: UploadDisposalAttachmentParams,
    payload: UploadDisposalAttachmentPayload
): Promise<UploadDisposalAttachmentResponse> => {
    const formData = new FormData()
    formData.append("transaction_disposal_asset_id", payload.transaction_disposal_asset_id)
    formData.append("attachment_config_id", payload.attachment_config_id)
    formData.append("stage", payload.stage)
    formData.append("file", payload.file)

    const response = await axiosPrivate.post<UploadDisposalAttachmentResponse>(
        "/transactions/disposal/attachments/upload",
        formData,
        {
            params: {
                transaction_number: params.transaction_number,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )

    return response.data
}
