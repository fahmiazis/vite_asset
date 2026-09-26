import { ReviewAttachmentDialog } from "../common/reviewAttachmentDialog"
import { useDisposalAttachmentFile } from "../../../hooks/query/disposal/attachmentFile"
import { useReviewDisposalAttachment } from "../../../hooks/mutation/disposal/reviewAttachment"
import type { DisposalAttachment } from "../../../models/disposal/detail"

interface ReviewAttachmentModalProps {
  attachment: DisposalAttachment
  /** false = dokumen hanya bisa dilihat, tanpa tombol keputusan */
  canDecide?: boolean
  onClose: () => void
}

/** Review satu dokumen disposal — tampilannya dari ReviewAttachmentDialog. */
export function ReviewAttachmentModal({
  attachment,
  canDecide = true,
  onClose,
}: ReviewAttachmentModalProps) {
  const { url, isLoading, error } = useDisposalAttachmentFile(attachment.id)
  const { mutate: review, isPending } = useReviewDisposalAttachment({ onSuccess: onClose })

  return (
    <ReviewAttachmentDialog
      fileName={attachment.file_name}
      attachmentType={attachment.attachment_type}
      assetNumber={attachment.asset_number}
      uploadedBy={attachment.uploaded_by}
      mimeType={attachment.mime_type}
      fileUrl={url}
      isLoadingFile={isLoading}
      fileError={error}
      canDecide={canDecide}
      isPending={isPending}
      onApprove={() => review({ id: attachment.id, payload: { status: "APPROVED" } })}
      onReject={(reason) =>
        review({ id: attachment.id, payload: { status: "REJECTED", rejection_reason: reason } })
      }
      onClose={onClose}
    />
  )
}
