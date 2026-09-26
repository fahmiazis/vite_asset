import { mutationAttachmentFile } from "../../../services/mutation/attachmentFile"
import { useAttachmentFile } from "../../useAttachmentFile"

export function useMutationAttachmentFile(attachmentId: number, enabled = true) {
  return useAttachmentFile(mutationAttachmentFile, attachmentId, enabled)
}
