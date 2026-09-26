import { disposalAttachmentFile } from "../../../services/disposal/attachmentFile"
import { useAttachmentFile } from "../../useAttachmentFile"

export { previewKindOf, type PreviewKind } from "../../../utils/attachmentPreview"

export function useDisposalAttachmentFile(attachmentId: number, enabled = true) {
  return useAttachmentFile(disposalAttachmentFile, attachmentId, enabled)
}
