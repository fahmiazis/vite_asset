import { useParams } from "react-router-dom"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisposalDetail } from "../../../../hooks/query/disposal/detail"
import { useDisposalStageGate } from "../../../../hooks/query/disposal/stageGate"
import { useDisposalAttachmentStatus } from "../../../../hooks/query/disposal/attachmentStatus"
import { useMyProfile } from "../../../../hooks/query/auth/myProfile"
import { AddAssetToDisposalModal } from "../../../organisms/disposal/addAssetModal"
import { RemoveAssetModal } from "../../../organisms/disposal/deleteAssetModal"
import AddAttachmentModal from "../../../organisms/disposal/addAttachmentModal"
import { DisposalAttachmentPanel } from "../../../organisms/disposal/attachmentPanel"
import { DisposalApprovalStatusPanel } from "../../../organisms/disposal/approvalStatusPanel"
import { DisposalDocumentsSection } from "../../../organisms/disposal/documentsSection"
import { DisposalStageStepper } from "../../../organisms/disposal/stageStepper"
import { SetIncomeValuesModal } from "../../../organisms/disposal/setIncomeValuesModal"
import { SetInvoicesModal } from "../../../organisms/disposal/setInvoicesModal"
import { DisposalStageActionBar } from "../../../organisms/disposal/stageActionBar"
import {
  DISPOSAL_STAGE,
  disposalStageLabel,
  disposalTypeLabel,
  formatRupiah,
  isSell,
  isTerminalStage,
  stageIndex,
  stagesForDisposalType,
} from "../../../../utils/disposalStage"
import type { DisposalAsset } from "../../../../models/disposal/detail"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; cls: string; label: string }> = {
    DRAFT: { dot: "bg-gray-400", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400", label: "Draft" },
    PENDING: { dot: "bg-yellow-400", cls: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400", label: "Pending" },
    PROCESSING: { dot: "bg-blue-500", cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Diproses" },
    APPROVED: { dot: "bg-green-500", cls: "bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-400", label: "Approved" },
    COMPLETED: { dot: "bg-blue-500", cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Selesai" },
    REJECTED: { dot: "bg-red-500", cls: "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400", label: "Ditolak" },
    CANCELLED: { dot: "bg-gray-400", cls: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400", label: "Dibatalkan" },
  }
  const s = map[status?.toUpperCase()] ?? { dot: "bg-gray-400", cls: "bg-gray-100 text-gray-600", label: status ?? "-" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function DisposalTypeBadge({ value }: { value: string }) {
  const cls = isSell(value)
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {disposalTypeLabel(value)}
    </span>
  )
}

function AssetStatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    PENDING: { cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700", label: "Pending" },
    DELETED: { cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700", label: "Dihapus" },
    CANCELLED: { cls: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", label: "Dibatalkan" },
  }
  const s = map[status?.toUpperCase()] ?? map.CANCELLED
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  )
}

export default function DisposalDetailPage() {
  const { "*": id } = useParams()
  const { t } = useTranslation()
  const { data, isLoading } = useDisposalDetail(id ?? "")

  const { data: profile } = useMyProfile()

  // undefined = belum dipilih manual → pakai stage berjalan (default terbuka)
  // null      = ditutup user
  const [pickedStage, setPickedStage] = useState<string | null | undefined>(undefined)

  const [showAddAsset, setShowAddAsset] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [assetToRemove, setAssetToRemove] = useState<{ id: number; name: string } | null>(null)
  // simpan baris disposal asset (bukan asset_id) untuk upload attachment
  const [attachTarget, setAttachTarget] = useState<DisposalAsset | null>(null)

  const transaction = data?.data?.transaction
  const stage = transaction?.current_stage?.toUpperCase() ?? ""

  // Kelengkapan dokumen — aturannya sama persis dengan disposal_flow_service.go
  const { canProceed, blockReason } = useDisposalStageGate(
    transaction?.transaction_number ?? "",
    stage
  )

  // Stage yang detailnya sedang dibuka. Dihitung sebelum early return karena
  // dipakai sebagai parameter hook di bawah.
  //
  // REJECTED tidak ada di daftar stage (bukan bagian alur normal) — fallback
  // ke stage pertama supaya panelnya tetap menunjuk ke sesuatu yang valid.
  const defaultStage =
    stageIndex(transaction?.disposal_type, stage) >= 0
      ? stage
      : stagesForDisposalType(transaction?.disposal_type)[0]
  const selectedStage = pickedStage === undefined ? defaultStage : pickedStage

  // Query key-nya sama persis dengan yang dipakai DisposalAttachmentPanel,
  // jadi react-query hanya melakukan satu request. Hasilnya dipakai untuk
  // memutuskan panel dokumen perlu dirender atau tidak.
  const { data: attachmentStatus, isLoading: isLoadingAttachments } =
    useDisposalAttachmentStatus(
      transaction?.transaction_number ?? "",
      selectedStage ?? ""
    )

  // Stage tanpa config attachment tidak perlu menampilkan panel dokumen sama
  // sekali. Dokumen yang terlanjur diupload sebelum config-nya dihapus tetap
  // ditampilkan supaya tidak hilang diam-diam.
  const stageHasDocuments = (attachmentStatus?.data?.assets ?? []).some(
    (asset) => asset.total_required > 0 || asset.attachments.length > 0
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!data?.data || !transaction) return null

  const { assets, stages } = data.data
  const isDraft = stage === DISPOSAL_STAGE.DRAFT

  // Approver menandai aset mana yang perlu diperbaiki. Selama penanda itu ada,
  // pengaju hanya boleh menyentuh aset bertanda — aturannya sama dengan
  // assertAssetRevisable di backend.
  const hasPendingRevision = assets.some(
    (asset) => asset.needs_revision && asset.status === "PENDING"
  )

  // Dokumen stage DRAFT dan EXECUTE adalah tanggung jawab pembuat transaksi —
  // aturannya ditegakkan juga di backend (UploadDisposalAttachment). Stage lain
  // dikerjakan tim terkait, jadi tombolnya tetap mengikuti permission.
  const isCreator = !!profile?.data?.id && profile.data.id === transaction.created_by

  // Dihitung backend dengan aturan yang sama seperti tab "Menunggu Saya":
  // hak akses role di route stage berjalan + irisan cabang, atau giliran
  // approval. Tombol aksi disembunyikan kalau bolanya bukan di user ini.
  const waitingForMe = data.data.waiting_for_me ?? false

  // Pengisian data per aset dibuka dari section aset, bukan dari bar bawah.
  // Bar bawah dibiarkan hanya untuk meneruskan transaksi ke stage berikutnya.
  const canFillIncome = waitingForMe && stage === DISPOSAL_STAGE.FINANCE
  const canFillInvoice = waitingForMe && stage === DISPOSAL_STAGE.TAX

  const canUploadAtStage = (target: string) => {
    if (!waitingForMe) return false
    return target === DISPOSAL_STAGE.DRAFT || target === DISPOSAL_STAGE.EXECUTE
      ? isCreator
      : true
  }
  const isAssetLocked = (asset: DisposalAsset) =>
    hasPendingRevision && !asset.needs_revision

  const stageHistory = selectedStage
    ? stages.filter((item) => item.to_stage?.toUpperCase() === selectedStage)
    : []

  const isApprovalStage =
    selectedStage === DISPOSAL_STAGE.APPROVAL_REQUEST ||
    selectedStage === DISPOSAL_STAGE.APPROVAL_AGREEMENT

  // stage yang belum dilalui dan tidak punya config dokumen tidak punya apa pun
  // untuk ditampilkan — kasih keterangan daripada area kosong
  const stageHasContent =
    isApprovalStage ||
    (assets.length > 0 && stageHasDocuments) ||
    stageHistory.length > 0

  return (
    <section className="space-y-4 mt-4">

      {showIncomeModal && (
        <SetIncomeValuesModal
          transactionNumber={transaction.transaction_number}
          assets={assets}
          onClose={() => setShowIncomeModal(false)}
        />
      )}
      {showInvoiceModal && (
        <SetInvoicesModal
          transactionNumber={transaction.transaction_number}
          assets={assets}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
      {showAddAsset && (
        <AddAssetToDisposalModal
          transactionNumber={transaction.transaction_number}
          existingAssetIds={assets.map((a) => a.asset_id)}
          onClose={() => setShowAddAsset(false)}
        />
      )}
      {assetToRemove && (
        <RemoveAssetModal
          transactionNumber={transaction.transaction_number}
          assetId={assetToRemove.id}
          assetName={assetToRemove.name}
          onClose={() => setAssetToRemove(null)}
        />
      )}
      {attachTarget && (
        <AddAttachmentModal
          transactionNumber={transaction.transaction_number}
          // FIX: backend minta ID baris transaction_disposal_assets, bukan asset_id
          transactionDisposalAssetId={String(attachTarget.id)}
          assetNumber={attachTarget.asset_number}
          // FIX: stage transaksi yang sebenarnya, bukan string literal
          stage={stage}
          onConfirm={() => setAttachTarget(null)}
          onCancel={() => setAttachTarget(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nomor transaksi</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono">
              {transaction.transaction_number}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <StatusBadge status={transaction.status} />
            <DisposalTypeBadge value={transaction.disposal_type} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-medium">
              {disposalStageLabel(transaction.current_stage)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("disposalDetail.info.transactionType"), value: transaction.transaction_type },
            { label: t("disposalDetail.info.date"), value: formatDate(transaction.transaction_date) },
            { label: t("disposalDetail.info.disposalType"), value: disposalTypeLabel(transaction.disposal_type) },
            { label: t("disposalDetail.info.createdBy"), value: transaction.created_by_name ?? transaction.created_by },
            { label: t("disposalDetail.info.createdAt"), value: formatDateTime(transaction.created_at) },
            { label: t("disposalDetail.info.updatedAt"), value: formatDateTime(transaction.updated_at) },
            ...(transaction.sale_value != null
              ? [{ label: t("disposalDetail.info.saleValue"), value: formatRupiah(transaction.sale_value) }]
              : []
            ),
            ...(transaction.approval_request_number
              ? [{ label: t("disposalDetail.info.requestNumber"), value: transaction.approval_request_number }]
              : []
            ),
            ...(transaction.approval_agreement_number
              ? [{ label: t("disposalDetail.info.agreementNumber"), value: transaction.approval_agreement_number }]
              : []
            ),
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Catatan</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {/* Progres stage — status tiap stage dibuka dari sini */}
      <DisposalStageStepper
        disposalType={transaction.disposal_type}
        currentStage={transaction.current_stage}
        selectedStage={selectedStage}
        onSelectStage={(next) =>
          // klik stage yang sedang terbuka → tutup
          setPickedStage(next === selectedStage ? null : next)
        }
      >
        {selectedStage && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-gray-400">
                {t("disposalStagePanel.showing", {
                  stage: disposalStageLabel(selectedStage),
                })}
              </p>
              {selectedStage === stage && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  {t("disposalStagePanel.currentStage")}
                </span>
              )}
            </div>

            {/* Status approval — hanya dua stage ini yang punya flow approval */}
            {selectedStage === DISPOSAL_STAGE.APPROVAL_REQUEST && (
              <DisposalApprovalStatusPanel
                embedded
                transactionNumber={transaction.transaction_number}
                kind="approval-request"
              />
            )}
            {selectedStage === DISPOSAL_STAGE.APPROVAL_AGREEMENT && (
              <DisposalApprovalStatusPanel
                embedded
                transactionNumber={transaction.transaction_number}
                kind="approval-agreement"
              />
            )}

            {/* Dokumen — hanya kalau stage ini memang punya config attachment */}
            {assets.length > 0 && stageHasDocuments && (
              <DisposalAttachmentPanel
                embedded
                transactionNumber={transaction.transaction_number}
                stage={selectedStage}
                // Unggah dokumen hanya dari section Dokumen di bawah. Panel ini
                // menampilkan stage yang sama, jadi kalau dua-duanya punya tombol
                // upload, satu aset bisa memunculkan tombol berkali-kali.
                canUpload={false}
                canReview={waitingForMe}
                onUploadForAsset={(assetNumber) => {
                  const target = assets.find((a) => a.asset_number === assetNumber)
                  if (target) setAttachTarget(target)
                }}
              />
            )}

            {!stageHasContent && !isLoadingAttachments && (
              <p className="text-sm text-gray-400 text-center py-6">
                {t("disposalStagePanel.nothingToShow")}
              </p>
            )}

            {/* Riwayat perpindahan menuju stage ini */}
            {stageHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  {t("disposalStagePanel.historyTitle")}
                </h4>
                <div className="space-y-1.5">
                  {stageHistory.map((item, index) => (
                    <div
                      key={item.id ?? index}
                      className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {item.action}
                          {item.actor_name && (
                            <span className="text-gray-400"> · {item.actor_name}</span>
                          )}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDateTime(item.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DisposalStageStepper>

      {/* Assets */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daftar Aset</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
              {assets.length} aset
            </span>
            {canFillIncome && (
              <button
                onClick={() => setShowIncomeModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 px-2.5 py-1 rounded-lg transition-colors"
              >
                {t("disposalAction.incomeValues.button")}
              </button>
            )}
            {canFillInvoice && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 px-2.5 py-1 rounded-lg transition-colors"
              >
                {t("disposalAction.invoices.button")}
              </button>
            )}
            {isDraft && !hasPendingRevision && (
              <button
                onClick={() => setShowAddAsset(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah aset
              </button>
            )}
          </div>
        </div>

        {isDraft && hasPendingRevision && (
          <div className="mb-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 space-y-1">
            <p>{t("disposalDetail.revisionBanner")}</p>
            {/* tanpa kalimat ini pengaju tidak tahu perbaikannya ditandai
                selesai lewat tombol submit yang sama */}
            <p className="font-medium">
              {t("disposalDetail.revisionHowTo", {
                action: t("disposalAction.submit.revisionButton"),
              })}
            </p>
          </div>
        )}

        {assets.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada aset yang ditambahkan
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div key={asset.id ?? index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Asset Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.asset_name ?? "-"}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{asset.asset_number ?? "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {asset.needs_revision && asset.status === "PENDING" && (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                        title={asset.revision_notes ?? undefined}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {t("disposalDetail.needsRevision")}
                      </span>
                    )}
                    <AssetStatusBadge status={asset.status} />
                    {isDraft && !isAssetLocked(asset) && (
                      <button
                        onClick={() => setAssetToRemove({ id: asset.asset_id, name: asset.asset_name ?? asset.asset_number })}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Hapus aset"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    {/* Upload dokumen tersedia di setiap stage aktif, sesuai config attachment stage tsb */}
                    {!isTerminalStage(stage) &&
                      asset.status === "PENDING" &&
                      !isAssetLocked(asset) &&
                      canUploadAtStage(stage) && (
                      <button
                        onClick={() => setAttachTarget(asset)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {t("disposalStagePanel.card.upload")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Asset Body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {asset.category_name && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Kategori</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.category_name}</p>
                      </div>
                    )}
                    {asset.branch_code && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Cabang</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.branch_code}</p>
                      </div>
                    )}
                    {asset.income_value != null && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          {t("disposalDetail.info.incomeValue")}
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {formatRupiah(asset.income_value)}
                        </p>
                      </div>
                    )}
                    {asset.invoice_number && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          {t("disposalDetail.info.invoiceNumber")}
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">
                          {asset.invoice_number}
                        </p>
                      </div>
                    )}
                    {asset.invoice_date && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          {t("disposalDetail.info.invoiceDate")}
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {formatDate(asset.invoice_date)}
                        </p>
                      </div>
                    )}
                    {asset.sale_value != null && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Nilai jual</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatRupiah(asset.sale_value)}</p>
                      </div>
                    )}
                    {asset.disposal_reason && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Alasan disposal</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.disposal_reason}</p>
                      </div>
                    )}
                    {asset.document_number && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">No. Dokumen</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{asset.document_number}</p>
                      </div>
                    )}
                  </div>

                  {asset.needs_revision && asset.revision_notes && (
                    <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                      <span className="font-medium">
                        {t("disposalDetail.revisionNote")}:
                      </span>{" "}
                      {asset.revision_notes}
                    </p>
                  )}

                  {asset.notes && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                      "{asset.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dokumen lintas stage — satu tempat untuk approver & audit */}
      {assets.length > 0 && (
        <DisposalDocumentsSection
          transactionNumber={transaction.transaction_number}
          disposalType={transaction.disposal_type}
          currentStage={stage}
          canUploadAtStage={canUploadAtStage}
          canReview={waitingForMe}
          onUploadForAsset={(assetNumber) => {
            const target = assets.find((a) => a.asset_number === assetNumber)
            if (target) setAttachTarget(target)
          }}
        />
      )}

      {/* Stage History */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Riwayat Stage</h3>

        {stages.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            Belum ada riwayat stage
          </div>
        ) : (
          <div className="space-y-0">
            {stages.map((stageItem, index) => {
              const isLast = index === stages.length - 1
              return (
                <div key={stageItem.id ?? index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0
                      ${isLast
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 mt-1 min-h-4 bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>

                  <div className="pb-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                            {disposalStageLabel(stageItem.from_stage)}
                          </p>
                          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {disposalStageLabel(stageItem.to_stage)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {stageItem.action}
                          {stageItem.actor_name && (
                            <span className="ml-1">· oleh {stageItem.actor_name}</span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDateTime(stageItem.created_at)}
                      </span>
                    </div>

                    {stageItem.notes && (
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                        "{stageItem.notes}"
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Aksi sesuai stage */}
      <DisposalStageActionBar
        transaction={transaction}
        assets={assets}
        canProceed={canProceed}
        blockReason={blockReason}
      />

    </section>
  )
}
