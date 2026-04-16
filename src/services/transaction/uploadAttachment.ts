import { axiosPrivate } from "../../libs/instance";

interface UploadAttachmentResponse {
    data: any
}

export interface UploadAttachmentParams {
    transaction_number: string
    transaction_type: string
    stage: string
}

export interface UploadAttachmentPayload {
    attachment_config_id: string
    file: File
}

export const uploadAttachment = async (
    params: UploadAttachmentParams,
    payload: UploadAttachmentPayload
): Promise<UploadAttachmentResponse> => {
    const formData = new FormData()
    formData.append('attachment_config_id', payload.attachment_config_id)
    formData.append('file', payload.file)

    const response = await axiosPrivate.post<UploadAttachmentResponse>(
        '/attachments/upload',
        formData,
        {
            params: {
                transaction_number: params.transaction_number,
                transaction_type: params.transaction_type,
                stage: params.stage,
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}