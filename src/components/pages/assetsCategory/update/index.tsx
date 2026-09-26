import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import Head from "../../../molecules/head"
import Buttons from "../../../atoms/buttons"
import { Inputs } from "../../../molecules/input/inputs"
import { Textareas } from "../../../molecules/input/textAreas"
import { useAssetsCategoryDetail } from "../../../../hooks/query/assetsCategory/detail"
import { useUpdateAssetsCategory } from "../../../../hooks/mutation/assetsCategory"
import type { UpdateAssetsCategoryPayload } from "../../../../models/assetsCategory/update"

/**
 * Ubah kategori aset. Semua field di dto.UpdateAssetCategoryRequest adalah
 * pointer, jadi yang tidak berubah sengaja tidak ikut dikirim.
 */
export default function UpdateAssetsCategory() {
  const { id } = useParams()
  const categoryId = Number(id)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading } = useAssetsCategoryDetail(categoryId)
  const category = data?.data

  const updateCategory = useUpdateAssetsCategory(categoryId)

  const [form, setForm] = useState({
    category_code: "",
    category_name: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    if (!category) return
    setForm({
      category_code: category.category_code ?? "",
      category_name: category.category_name ?? "",
      description: category.description ?? "",
      is_active: !!category.is_active,
    })
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    const code = form.category_code.trim().toUpperCase()
    const name = form.category_name.trim()
    const description = form.description.trim()

    if (code.length < 2) return toast.error(t("assetCategory.validation.code"))
    if (name.length < 2) return toast.error(t("assetCategory.validation.name"))

    const payload: UpdateAssetsCategoryPayload = {}
    if (code !== category.category_code) payload.category_code = code
    if (name !== category.category_name) payload.category_name = name
    if (description !== (category.description ?? "")) payload.description = description
    if (form.is_active !== !!category.is_active) payload.is_active = form.is_active

    if (Object.keys(payload).length === 0) {
      toast.error(t("assetCategory.validation.noChanges"))
      return
    }

    updateCategory.mutate(payload, {
      onSuccess: () => navigate("/dashboard/asset-category"),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!category) return null

  return (
    <form onSubmit={handleSubmit}>
      <Head label={t("assetCategory.updateTitle")} className="mb-4" />

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <section className="flex gap-4">
          <Inputs
            label={t("assetCategory.column.code")}
            value={form.category_code}
            onChange={(value) => setForm((prev) => ({ ...prev, category_code: value }))}
            helperText={t("assetCategory.codeHelper")}
            containerClassName="w-1/2"
            required
          />
          <Inputs
            label={t("assetCategory.column.name")}
            value={form.category_name}
            onChange={(value) => setForm((prev) => ({ ...prev, category_name: value }))}
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

        {!form.is_active && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            {t("assetCategory.inactiveWarning")}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <Buttons
            label={t("assetCategory.cancel")}
            onClick={() => navigate("/dashboard/asset-category")}
            disable={updateCategory.isPending}
          />
          <Buttons
            label={
              updateCategory.isPending
                ? t("assetCategory.saving")
                : t("assetCategory.save")
            }
            onClick={handleSubmit}
            disable={updateCategory.isPending}
          />
        </div>
      </div>
    </form>
  )
}
