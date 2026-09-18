"use client"

import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Textareas } from "../../../molecules/input/textAreas"
import type { CreateStockOpnameDraftRequest } from "../../../../models/stockOpname/create"
import { useCreateStockOpnameDraft } from "../../../../hooks/mutation/stockOpname/create"

export default function CreateStockOpnamePage() {
  const navigate = useNavigate()

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
        <h2 className="text-xl font-semibold">Buat Stock Opname</h2>
        <p className="text-sm text-gray-500">
          Buat draft stock opname, aset akan ditambahkan setelah draft tersimpan
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        {/* Transaction Date */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tanggal Opname
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
              label="Catatan"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Contoh: Opname rutin Q3 gudang Bandung Barat"
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
          Batal
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isPending}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Menyimpan..." : "Simpan Draft"}
        </button>
      </div>
    </div>
  )
}
