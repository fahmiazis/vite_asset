"use client"

import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Textareas } from "../../../molecules/input/textAreas"
import type { CreateStockOpnameDraftRequest } from "../../../../models/stockOpname/create"
import { useCreateStockOpnameDraft } from "../../../../hooks/mutation/stockOpname/create"

export default function CreateStockOpnamePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const todayLabel = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateStockOpnameDraftRequest>({
    mode: "onChange",
    defaultValues: {
      notes: "",
    },
  })

  const { mutate: submitDraft, isPending } = useCreateStockOpnameDraft()

  const onSubmit = (values: CreateStockOpnameDraftRequest) => {
    submitDraft(values)
  }

  return (
    <div className="w-full mx-auto space-y-6 py-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("createStockOpnamePage.title")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("createStockOpnamePage.subtitle")}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">

        {/* Transaction Date — otomatis tanggal hari ini, gak bisa diubah */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("createStockOpnamePage.dateLabel")}
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {todayLabel}
          </div>
        </div>

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Textareas
              label={t("createStockOpnamePage.notesLabel")}
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder={t("createStockOpnamePage.notesPlaceholder")}
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isPending}
          className="flex-1 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {t("createStockOpnamePage.cancel")}
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isPending}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? t("createStockOpnamePage.submitting") : t("createStockOpnamePage.submit")}
        </button>
      </div>
    </div>
  )
}
