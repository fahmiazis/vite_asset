import { useDisposalAttachmentStatus } from "./attachmentStatus"
import {
  DISPOSAL_STAGE,
  attachmentsUploadedForStage,
  disposalStageLabel,
  isTerminalStage,
} from "../../../utils/disposalStage"

/** Stage yang transisinya mengecek dokumen stage itu sendiri (requireApproved=false) */
const CHECKS_OWN_STAGE_DOCS: string[] = [
  DISPOSAL_STAGE.DRAFT,
  DISPOSAL_STAGE.PURCHASING,
  DISPOSAL_STAGE.EXECUTE,
  DISPOSAL_STAGE.FINANCE,
  DISPOSAL_STAGE.TAX,
]

/** Stage yang transisinya juga mensyaratkan dokumen DRAFT sudah APPROVED semua */
const REQUIRES_APPROVED_DRAFT_DOCS: string[] = [
  DISPOSAL_STAGE.PURCHASING,
  DISPOSAL_STAGE.EXECUTE,
  DISPOSAL_STAGE.FINANCE,
  DISPOSAL_STAGE.TAX,
]

/**
 * Menentukan apakah aksi lanjut stage akan diterima backend, dengan aturan
 * yang sama persis seperti disposal_flow_service.go.
 */
export function useDisposalStageGate(transactionNumber: string, stage: string) {
  const active = !!transactionNumber && !!stage && !isTerminalStage(stage)

  const needsOwnDocs = active && CHECKS_OWN_STAGE_DOCS.includes(stage)
  const needsDraftApproved = active && REQUIRES_APPROVED_DRAFT_DOCS.includes(stage)

  const { data: currentStatus, isLoading: loadingCurrent } =
    useDisposalAttachmentStatus(transactionNumber, stage, needsOwnDocs)

  const { data: draftStatus, isLoading: loadingDraft } = useDisposalAttachmentStatus(
    transactionNumber,
    DISPOSAL_STAGE.DRAFT,
    needsDraftApproved
  )

  const isLoading = loadingCurrent || loadingDraft

  // selama data belum ada, jangan blokir tombol secara keliru
  if (isLoading) {
    return { canProceed: true, blockReason: undefined, isLoading: true }
  }

  if (needsOwnDocs && currentStatus?.data) {
    if (!attachmentsUploadedForStage(currentStatus.data.assets)) {
      return {
        canProceed: false,
        blockReason: `Dokumen stage ${disposalStageLabel(stage)} belum lengkap diupload (atau ada yang ditolak)`,
        isLoading: false,
      }
    }
  }

  if (needsDraftApproved && draftStatus?.data) {
    if (!draftStatus.data.all_can_proceed) {
      return {
        canProceed: false,
        blockReason: "Dokumen stage Draft belum semuanya disetujui reviewer",
        isLoading: false,
      }
    }
  }

  return { canProceed: true, blockReason: undefined, isLoading: false }
}
