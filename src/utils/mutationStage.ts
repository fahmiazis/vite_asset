import i18n from "../i18n"

/**
 * Urutan stage mutasi — sama dengan nextStage di
 * services/transaction_email_service.go (TxMutationFlow).
 */
export const MUTATION_STAGES = [
  "DRAFT",
  "APPROVAL",
  "MUTATION_RECEIVING",
  "EXECUTE_MUTATION",
  "FINISHED",
] as const

/** stage akhir di luar jalur normal */
export const MUTATION_TERMINAL_STAGES = ["REJECTED", "CANCELLED"]

/** nama stage tetap English di semua locale (identitas data, bukan kalimat) */
export function mutationStageLabel(stage: string) {
  return i18n.t(`mutationStage.stage.${stage}`, { defaultValue: stage })
}
