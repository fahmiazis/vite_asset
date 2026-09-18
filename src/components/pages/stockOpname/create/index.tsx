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

  const today = new Date().toISOString().split("T")[0]

  const {
    control,
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<CreateStockOpnameDraftRequest>({
    mode: "onChange",
    defaultValues: {
      transaction_date: today,
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
        <h2 className="text-xl font-semibold">{t("createStockOpnamePage.title")}</h2>
        <p className="text-sm text-gray-500">
          {t("createStockOpnamePage.subtitle")}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        {/* Transaction Date */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("createStockOpnamePage.dateLabel")}
          </label>
          <input
            type="date"
            {...register("transaction_date", { required: true })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          className="flex-1 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
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
