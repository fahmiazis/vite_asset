import { ReviewAttachmentDialog } from "../common/reviewAttachmentDialog"
import { useMutationAttachmentFile } from "../../../hooks/query/mutation/attachmentFile"
import { useReviewMutationAttachment } from "../../../hooks/mutation/mutation/reviewAttachment"
import type { MutationAttachment } from "../../../models/mutation/attachmentStatus"

interface ReviewMutationAttachmentModalProps {
  attachment: MutationAttachment
  /** false = dokumen hanya bisa dilihat, tanpa tombol keputusan */
  canDecide?: boolean
  onClose: () => void
}

/** Review satu dokumen mutasi — tampilannya dari ReviewAttachmentDialog. */
export function ReviewMutationAttachmentModal({
  attachment,
  canDecide = true,
  onClose,
}: ReviewMutationAttachmentModalProps) {
  const { url, isLoading, error } = useMutationAttachmentFile(attachment.id)
  const { mutate: review, isPending } = useReviewMutationAttachment({ onSuccess: onClose })

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
