import { axiosPrivate } from "../../libs/instance"

interface UploadMutationAttachmentResponse {
  data: unknown
  message: string
  status: string
}

export interface UploadMutationAttachmentParams {
  transaction_number: string
}

export interface UploadMutationAttachmentPayload {
  /** ID baris transaction_mutation_assets (asset.id pada response detail), BUKAN asset_id */
  transaction_mutation_asset_id: string
  attachment_config_id: string
  file: File
}

export const uploadMutationAttachment = async (
  params: UploadMutationAttachmentParams,
  payload: UploadMutationAttachmentPayload
): Promise<UploadMutationAttachmentResponse> => {
  const formData = new FormData()
  formData.append("transaction_mutation_asset_id", payload.transaction_mutation_asset_id)
  formData.append("attachment_config_id", payload.attachment_config_id)
  formData.append("file", payload.file)

  const response = await axiosPrivate.post<UploadMutationAttachmentResponse>(
    "/transactions/mutation/attachments/upload",
    formData,
    {
      params: { transaction_number: params.transaction_number },
      headers: { "Content-Type": "multipart/form-data" },
    }
  )

  return response.data
}
