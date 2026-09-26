/**
 * Serah terima aset — nilai harus sama dengan models/handover_flow.go.
 */
export const HANDOVER_STAGE = {
  DRAFT: "DRAFT",
  APPROVAL: "APPROVAL",
  RECEIVING: "HANDOVER_RECEIVING",
  FINISHED: "FINISHED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const

export const handoverStages = [
  HANDOVER_STAGE.DRAFT,
  HANDOVER_STAGE.APPROVAL,
  HANDOVER_STAGE.RECEIVING,
  HANDOVER_STAGE.FINISHED,
]

export type HandoverType = "HANDOVER" | "RETURN"

export const isHandoverTerminal = (stage?: string) =>
  stage === HANDOVER_STAGE.FINISHED ||
  stage === HANDOVER_STAGE.REJECTED ||
  stage === HANDOVER_STAGE.CANCELLED
