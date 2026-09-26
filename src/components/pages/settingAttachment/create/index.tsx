import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Inputs } from "../../../molecules/input/inputs"
import { Selects } from "../../../molecules/input/selects"
import { ToggleRow } from "../../../organisms/attachmentSetting/column"
import { useCreateAttachmentSetting } from "../../../../hooks/mutation/attachSetting/create"
import { useBranchList } from "../../../../hooks/query/branch/list"
import toast from "react-hot-toast"
import { Textareas } from "../../../molecules/input/textAreas"
import {
  ATTACHMENT_ALL,
  attachmentStageOptions,
  attachmentTransactionTypes,
} from "../../../../constans/attachment"

export default function CreateAttachmentSettingPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateAttachmentSetting()

  const [form, setForm] = useState({
    transaction_type: "",
    stage: ATTACHMENT_ALL,
    branch_code: ATTACHMENT_ALL,
    attachment_type: "",
    description: "",
    is_required: false,
    is_active: true,
  })

  const { data: branchData, isLoading: isLoadingBranches } = useBranchList()

  // ALL berarti berlaku untuk semua cabang — itu nilai yang dipakai backend,
  // bukan sekadar label kosong
  const branchOptions = [
    { id: ATTACHMENT_ALL, value: ATTACHMENT_ALL, label: "ALL — semua cabang" },
    ...(branchData?.data ?? []).map((branch) => ({
      id: branch.branch_code,
      value: branch.branch_code,
      label: `${branch.branch_code} — ${branch.branch_name}`,
    })),
  ]

  const stageOptions = attachmentStageOptions(form.transaction_type)

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // ganti jenis transaksi → stage lamanya belum tentu ada di alur baru
  const handleTransactionTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, transaction_type: value, stage: ATTACHMENT_ALL }))
  }

  const handleSubmit = () => {
    if (!form.transaction_type) {
      toast.error("Jenis transaksi wajib dipilih")
      return
    }
    if (!form.attachment_type.trim()) {
      toast.error("Jenis dokumen wajib diisi")
      return
    }

    mutate({ ...form, attachment_type: form.attachment_type.trim().toUpperCase() }, {
      onSuccess: () => {
        toast.success("Created successfully")
      },
      onError: () => {
        toast.error("Failed to create")
      },
    })
  }

  return (
    <div className="w-full mx-auto space-y-4 py-4">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg"
      >
        ← Kembali
      </button>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 border rounded-xl p-6 space-y-5">

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Attachment Setting
        </h3>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">

          <Selects
            label="Transaction Type"
            value={form.transaction_type}
            onChange={handleTransactionTypeChange}
            options={attachmentTransactionTypes}
            placeholder="Pilih jenis transaksi..."
            required
          />

          <Selects
            label="Stage"
            value={form.stage}
            onChange={(v) => handleChange("stage", v)}
            options={stageOptions}
            placeholder="Pilih stage..."
            helperText={
              form.transaction_type && form.transaction_type !== ATTACHMENT_ALL
                ? "Daftar stage mengikuti alur transaksi yang dipilih."
                : "Pilih jenis transaksi dulu untuk melihat stage-nya."
            }
            required
          />

          <Selects
            label="Branch Code"
            value={form.branch_code}
            onChange={(v) => handleChange("branch_code", v)}
            options={branchOptions}
            placeholder="Pilih cabang..."
            disabled={isLoadingBranches}
            required
          />

          <Inputs
            label="Attachment Type"
            value={form.attachment_type}
            onChange={(v) => handleChange("attachment_type", v)}
            placeholder="mis. SURAT_PENGAJUAN"
            helperText="Nama jenis dokumen, bebas diisi. Disimpan dalam huruf kapital."
            required
          />

        </div>

        {/* Toggle */}
        <div className="space-y-4">
          <ToggleRow
            label="Required"
            value={form.is_required}
            onChange={(v) => handleChange("is_required", v)}
          />
          <ToggleRow
            label="Active"
            value={form.is_active}
            onChange={(v) => handleChange("is_active", v)}
          />
        </div>

        {/* Description */}
        <Textareas
          label="Description"
          value={form.description}
          onChange={(v) => handleChange("description", v)}
          rows={3}
        />

        {/* Action */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {isPending ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}