import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { Search01Icon } from "hugeicons-react"
import Head from "../../molecules/head"
import {
  useHandoverDetail,
  useHandoverEligibleAssets,
  useHandoverRecipients,
} from "../../../hooks/query/handover"
import { useCreateHandover, useUpdateHandoverDraft } from "../../../hooks/mutation/handover"
import type { HandoverType } from "../../../constans/handover"
import { toDateInput } from "../../../utils/dateRange"

/**
 * Buat ajuan serah terima baru, atau ubah draft (?edit=<nomor>).
 *
 * Pilihan aset & penerima datang dari backend yang sudah membatasi ke cabang
 * HOMEBASE user — serah terima lintas cabang harus lewat mutasi dulu.
 */
export default function HandoverFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editNumber = searchParams.get("edit") ?? ""
  const isEdit = !!editNumber

  const { data: detailData, isLoading: isLoadingDetail } = useHandoverDetail(editNumber)
  const draft = detailData?.data

  const [handoverType, setHandoverType] = useState<HandoverType>("HANDOVER")
  const [toUserId, setToUserId] = useState("")
  const [transactionDate, setTransactionDate] = useState(toDateInput(new Date()))
  const [notes, setNotes] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const [search, setSearch] = useState("")

  // isi form dari draft sekali saat datanya termuat
  const loaded = useRef(false)
  useEffect(() => {
    if (!draft || loaded.current) return
    loaded.current = true
    setHandoverType(draft.handover_type)
    setToUserId(draft.to_user_id ?? "")
    setNotes(draft.transaction.notes ?? "")
    setSelected(draft.assets.filter((a) => a.status === "PENDING").map((a) => a.asset_id))
  }, [draft])

  const { data: recipients = [], isLoading: isLoadingRecipients } = useHandoverRecipients(handoverType === "HANDOVER")
  const { data: assets = [], isLoading: isLoadingAssets } = useHandoverEligibleAssets(handoverType, search, editNumber || undefined)

  const createHandover = useCreateHandover()
  const updateDraft = useUpdateHandoverDraft(editNumber)
  const isPending = createHandover.isPending || updateDraft.isPending

  // aset yang sudah dipegang penerima tidak bisa diserahkan ke dia lagi
  const selectable = useMemo(
    () => assets.filter((a) => !(handoverType === "HANDOVER" && toUserId && a.assigned_user_id === toUserId)),
    [assets, handoverType, toUserId]
  )

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const allVisibleSelected = selectable.length > 0 && selectable.every((a) => selected.includes(a.asset_id))
  const toggleAll = () =>
    setSelected((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !selectable.some((a) => a.asset_id === id))
        : Array.from(new Set([...prev, ...selectable.map((a) => a.asset_id)]))
    )

  const changeType = (type: HandoverType) => {
    if (isEdit || type === handoverType) return
    setHandoverType(type)
    setSelected([]) // daftar aset berbeda per jenis
  }

  const handleSubmit = () => {
    if (handoverType === "HANDOVER" && !toUserId) {
      toast.error(t("handover.form.errors.recipient"))
      return
    }
    if (selected.length === 0) {
      toast.error(t("handover.form.errors.assets"))
      return
    }

    const goToDetail = (number: string) => navigate(`/dashboard/handover/${number}`)
    if (isEdit) {
      updateDraft.mutate(
        { to_user_id: toUserId || undefined, notes: notes.trim() || undefined, asset_ids: selected },
        { onSuccess: () => goToDetail(editNumber) }
      )
      return
    }
    createHandover.mutate(
      {
        handover_type: handoverType,
        to_user_id: handoverType === "HANDOVER" ? toUserId : undefined,
        transaction_date: transactionDate,
        notes: notes.trim() || undefined,
        asset_ids: selected,
      },
      { onSuccess: (res) => goToDetail(res.data.transaction.transaction_number) }
    )
  }

  if (isEdit && isLoadingDetail) {
    return <p className="p-6 text-sm text-gray-400">{t("handover.loading")}</p>
  }
  if (isEdit && draft && draft.transaction.current_stage !== "DRAFT") {
    return <p className="p-6 text-sm text-gray-500">{t("handover.form.notDraft")}</p>
  }

  const typeButton = (type: HandoverType) => (
    <button
      type="button"
      onClick={() => changeType(type)}
      disabled={isEdit}
      className={`flex-1 text-left px-4 py-3 rounded-xl border transition-colors disabled:cursor-not-allowed ${
        handoverType === type
          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-700"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      } ${isEdit && handoverType !== type ? "opacity-40" : ""}`}
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t(`handover.type.${type}`)}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(`handover.form.typeHint.${type}`)}</p>
    </button>
  )

  return (
    <div className="space-y-4">
      <Head label={isEdit ? t("handover.form.editTitle") : t("handover.form.createTitle")} className="mb-2" />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5">
        <div className="flex items-start gap-3 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-700 dark:text-indigo-300">
          {t("handover.form.homebaseRule")}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("handover.form.type")}</label>
          <div className="flex flex-col sm:flex-row gap-2">
            {typeButton("HANDOVER")}
            {typeButton("RETURN")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {handoverType === "HANDOVER" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("handover.form.recipient")} <span className="text-red-500">*</span>
              </label>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                disabled={isLoadingRecipients}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="">{t("handover.form.recipientPlaceholder")}</option>
                {recipients.map((r) => (
                  <option key={r.user_id} value={r.user_id}>
                    {r.fullname} ({r.username})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">{t("handover.form.recipientHint")}</p>
            </div>
          )}
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("handover.form.date")}</label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("handover.form.notes")} <span className="text-gray-400 font-normal">({t("handover.optional")})</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none"
          />
        </div>

        {/* Pilih aset */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("handover.form.assets")} <span className="text-red-500">*</span>
              <span className="ml-2 text-xs font-normal text-indigo-600 dark:text-indigo-400">
                {t("handover.form.selected", { count: selected.length })}
              </span>
            </p>
            <div className="relative">
              <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("handover.form.searchAssets")}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-64 max-w-full"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-auto max-h-[420px]">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-gray-800/60 sticky top-0">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2.5 w-10">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} disabled={selectable.length === 0} />
                  </th>
                  <th className="px-3 py-2.5">{t("handover.column.assetNumber")}</th>
                  <th className="px-3 py-2.5">{t("handover.column.assetName")}</th>
                  <th className="px-3 py-2.5">{t("handover.column.category")}</th>
                  <th className="px-3 py-2.5">{t("handover.column.holder")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectable.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                      {isLoadingAssets ? t("handover.loading") : t(`handover.form.noAssets.${handoverType}`)}
                    </td>
                  </tr>
                ) : (
                  selectable.map((a) => (
                    <tr
                      key={a.asset_id}
                      onClick={() => toggle(a.asset_id)}
                      className={`cursor-pointer ${selected.includes(a.asset_id) ? "bg-indigo-50/60 dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}`}
                    >
                      <td className="px-3 py-2.5">
                        <input type="checkbox" checked={selected.includes(a.asset_id)} onChange={() => toggle(a.asset_id)} onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">{a.asset_number}</td>
                      <td className="px-3 py-2.5">{a.asset_name}</td>
                      <td className="px-3 py-2.5 text-gray-500">{a.category_name ?? "-"}</td>
                      <td className="px-3 py-2.5 text-gray-500">{a.assigned_user_name ?? t("handover.heldByBranch")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            disabled={isPending}
            className="flex-1 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {t("handover.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? t("handover.saving") : isEdit ? t("handover.form.saveDraft") : t("handover.form.createDraft")}
          </button>
        </div>
      </div>
    </div>
  )
}
