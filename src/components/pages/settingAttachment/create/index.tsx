import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Inputs } from "../../../molecules/input/inputs"
import { ToggleRow } from "../../../organisms/attachmentSetting/column"
import { useCreateAttachmentSetting } from "../../../../hooks/mutation/attachSetting/create"
import toast from "react-hot-toast"
import { Textareas } from "../../../molecules/input/textAreas"

export default function CreateAttachmentSettingPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateAttachmentSetting()

  const [form, setForm] = useState({
    transaction_type: "",
    stage: "",
    branch_code: "",
    attachment_type: "",
    description: "",
    is_required: false,
    is_active: true,
  })

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.transaction_type || !form.attachment_type) {
      toast.error("Please fill required fields")
      return
    }

    mutate(form, {
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

          <Inputs
            label="Transaction Type"
            value={form.transaction_type}
            onChange={(v) => handleChange("transaction_type", v)}
          />

          <Inputs
            label="Stage"
            value={form.stage}
            onChange={(v) => handleChange("stage", v)}
          />

          <Inputs
            label="Branch Code"
            value={form.branch_code}
            onChange={(v) => handleChange("branch_code", v)}
          />

          <Inputs
            label="Attachment Type"
            value={form.attachment_type}
            onChange={(v) => handleChange("attachment_type", v)}
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