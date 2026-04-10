import { axiosPrivate } from "../../libs/instance"

export interface UploadAttachmentParams {
    transaction_number: string
    transaction_type: string
    stage: string
    attachment_config_id: number
    file: File
}

export const uploadAttachment = async (params: UploadAttachmentParams) => {
    const encodedId = encodeURIComponent(params.transaction_number)

    const formData = new FormData()
    formData.append("attachment_config_id", String(params.attachment_config_id))
    formData.append("file", params.file)

    const response = await axiosPrivate.post(
        `/attachments/upload?transaction_number=${encodedId}&transaction_type=${params.transaction_type}&stage=${params.stage}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data
}