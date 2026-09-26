import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import Head from "../../../molecules/head"
import Buttons from "../../../atoms/buttons"
import { Inputs } from "../../../molecules/input/inputs"
import { Textareas } from "../../../molecules/input/textAreas"
import { useCreateAssetsCategory } from "../../../../hooks/mutation/assestCategory/create"

/**
 * Buat kategori aset.
 *
 * Backend mewajibkan category_code (2-50) dan category_name (2-255);
 * sebelumnya form ini mengirim apa adanya tanpa validasi, jadi kode kosong
 * baru ketahuan salah setelah ditolak server.
 */
export default function CreateAssetsCategory() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    category_code: "",
    category_name: "",
    description: "",
    is_active: true,
  })

  const createAssetsCategory = useCreateAssetsCategory({
    redirectOnSuccess: true,
    redirectPath: "/dashboard/asset-category",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const code = form.category_code.trim()
    const name = form.category_name.trim()

    if (code.length < 2) return toast.error(t("assetCategory.validation.code"))
    if (name.length < 2) return toast.error(t("assetCategory.validation.name"))

    createAssetsCategory.mutate({
      category_code: code.toUpperCase(),
      category_name: name,
      description: form.description.trim(),
      is_active: form.is_active,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Head label={t("assetCategory.createTitle")} className="mb-4" />

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <section className="flex gap-4">
          <Inputs
            label={t("assetCategory.column.code")}
            value={form.category_code}
            onChange={(value) => setForm((prev) => ({ ...prev, category_code: value }))}
            placeholder="mis. VHCL"
            helperText={t("assetCategory.codeHelper")}
            containerClassName="w-1/2"
            required
          />
          <Inputs
            label={t("assetCategory.column.name")}
            value={form.category_name}
            onChange={(value) => setForm((prev) => ({ ...prev, category_name: value }))}
            placeholder="mis. Vehicle"
            containerClassName="w-1/2"
            required
          />
        </section>

        <div className="mt-4">
          <Textareas
            label={t("assetCategory.column.description")}
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            placeholder={t("assetCategory.descriptionPlaceholder")}
            rows={3}
          />
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("assetCategory.active")}
          </span>
        </label>

        <div className="mt-6 flex gap-2">
          <Buttons
            label={t("assetCategory.cancel")}
            onClick={() => navigate("/dashboard/asset-category")}
            disable={createAssetsCategory.isPending}
          />
          <Buttons
            label={
              createAssetsCategory.isPending
                ? t("assetCategory.saving")
                : t("assetCategory.create")
            }
            onClick={handleSubmit}
            disable={createAssetsCategory.isPending}
          />
        </div>
      </div>
    </form>
  )
}
