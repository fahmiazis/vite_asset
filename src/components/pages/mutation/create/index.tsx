"use client"

import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Textareas } from "../../../molecules/input/textAreas"
import { Selects } from "../../../molecules/input/selects"
import { useAssetsCategoryList } from "../../../../hooks/query/assetsCategory/list"
import { useBranchList } from "../../../../hooks/query/branch/list"
import type { CreateMutationRequest } from "../../../../models/mutation/create"
import { useCreateMutation } from "../../../../hooks/mutation/mutation/create"
import { activeCategoryListToSelectOptions } from "../../../../utils/assetCategory"
import { activeBranchListToSelectOptions } from "../../../../utils/branch"

export default function CreateMutationPage() {
  const navigate = useNavigate()

  const today = new Date().toISOString().split("T")[0]

  // ─── REMOTE DATA ────────────────────────────────
  const { data: listCategory } = useAssetsCategoryList()
  const { data: branchList } = useBranchList()

  // ─── FORM ────────────────────────────────────────
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<CreateMutationRequest>({
    mode: "onChange",
    defaultValues: {
      transaction_date: today,
      category_id: undefined,
      to_branch_code: "",
      notes: "",
    },
  })

  // ─── MUTATION ────────────────────────────────────
  const { mutate: submitMutation, isPending } = useCreateMutation({
    redirectOnSuccess: true,
    redirectPath: "/dashboard/mutation",
  })

  const onSubmit = (values: CreateMutationRequest) => {
    submitMutation(values)
  }

  return (
    <div className="w-full mx-auto space-y-6 py-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Create Mutation</h2>
        <p className="text-sm text-gray-500">
          Isi detail mutasi aset di bawah ini
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        {/* Transaction Date — read-only, auto hari ini */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transaction Date
          </label>
          <input
            type="date"
            readOnly
            {...register("transaction_date")}
            className="border rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Category */}
        {listCategory && (
          <Controller
            control={control}
            name="category_id"
            rules={{ required: "Category is required" }}
            render={({ field, fieldState }) => (
              <Selects
                label="Category"
                value={field.value ?? ""}
                onChange={(v) => field.onChange(Number(v))}
                options={activeCategoryListToSelectOptions(listCategory.data)}
                placeholder="Pilih kategori"
                error={fieldState.error?.message}
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                selectClassName="text-sm py-2"
                required
              />
            )}
          />
        )}

        {/* To Branch Code */}
        {branchList && (
          <Controller
            control={control}
            name="to_branch_code"
            rules={{ required: "Branch is required" }}
            render={({ field, fieldState }) => (
              <Selects
                label="To Branch"
                value={field.value ?? ""}
                onChange={field.onChange}
                options={activeBranchListToSelectOptions(branchList?.data)}
                placeholder="Pilih branch tujuan"
                error={fieldState.error?.message}
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                selectClassName="text-sm py-2"
                required
              />
            )}
          />
        )}

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Textareas
              label="Notes"
              value={field.value}
              onChange={field.onChange}
              placeholder="Contoh: Mutasi asset IT dari Bandung Barat ke Tangerang"
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
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isPending}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  )
}