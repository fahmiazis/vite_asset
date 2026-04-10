import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useParams, useNavigate } from "react-router-dom"
import { Selects } from "../../../molecules/input/selects"
import { useUpdateDepreciation } from "../../../../hooks/mutation/depreciation/update"
import { useDepreDetail } from "../../../../hooks/query/depreciation/detail"
import { useEffect } from "react"

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateDepreciationSchema = z.object({
    useful_life_months: z.number().min(1, "Minimum 1 month"),
    depreciation_rate: z.number().nullable().optional(),
    end_date: z.string().nullable().optional(),
    is_active: z.boolean(),
})

export type UpdateDepreciationFormValues = z.infer<typeof updateDepreciationSchema>

// ─── Options ─────────────────────────────────────────────────────────────────

const CALCULATION_METHOD_OPTIONS = [
    { id: "STRAIGHT_LINE", value: "STRAIGHT_LINE", label: "Straight Line" },
    { id: "DECLINING_BALANCE", value: "DECLINING_BALANCE", label: "Declining Balance" },
]

const DEPRECIATION_PERIOD_OPTIONS = [
    { id: "MONTHLY", value: "MONTHLY", label: "Monthly" },
]

// ─── Sub Components ───────────────────────────────────────────────────────────

function TextInput({
    label, error, required, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; required?: boolean }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                {...props}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${error
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
                    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100
                    ${props.disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60" : ""}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function UpdateDepreciationPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: res, isLoading } = useDepreDetail(id || '')
    const detail = res?.data

    const {
        register, control, handleSubmit, watch, reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateDepreciationFormValues>({
        resolver: zodResolver(updateDepreciationSchema),
        defaultValues: {
            useful_life_months: undefined,
            depreciation_rate: null,
            end_date: null,
            is_active: true,
        },
    })

    // populate form setelah data detail loaded
    useEffect(() => {
        if (detail) {
            reset({
                useful_life_months: detail.useful_life_months,
                depreciation_rate: detail.depreciation_rate ?? null,
                end_date: detail.end_date ?? null,
                is_active: detail.is_active,
            })
        }
    }, [detail, reset])

    const { mutate, isPending } = useUpdateDepreciation(id || '')

    const onSubmit = (data: UpdateDepreciationFormValues) => {
        mutate({
            useful_life_months: data.useful_life_months,
            depreciation_rate: data.depreciation_rate ?? null,
            end_date: data.end_date ?? null,
            is_active: data.is_active,
        })
    }

    const calculationMethod = detail?.calculation_method ?? ""

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading data...</p>
                </div>
            </div>
        )
    }

    return (
        <section className="space-y-5 mt-4">

            {/* Setting Info — readonly */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">1</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Setting Information</h3>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Read Only</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <TextInput
                        label="Setting Type"
                        value={detail?.setting_type ?? "-"}
                        disabled
                    />
                    <TextInput
                        label="Reference"
                        value={detail?.reference_value ?? "-"}
                        disabled
                    />
                </div>
            </div>

            {/* Calculation Config — sebagian readonly */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">2</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Calculation Configuration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* readonly */}
                    <Selects
                        label="Calculation Method"
                        value={detail?.calculation_method ?? ""}
                        onChange={() => {}}
                        options={CALCULATION_METHOD_OPTIONS}
                        placeholder="Select method"
                        labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        selectClassName="text-sm py-2 opacity-50 cursor-not-allowed pointer-events-none"
                    />

                    <Selects
                        label="Depreciation Period"
                        value="MONTHLY"
                        onChange={() => {}}
                        options={DEPRECIATION_PERIOD_OPTIONS}
                        placeholder="Select period"
                        labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        selectClassName="text-sm py-2 opacity-50 cursor-not-allowed pointer-events-none"
                    />

                    {/* editable */}
                    <TextInput
                        label="Useful Life (Months)"
                        type="number"
                        required
                        min={1}
                        placeholder="60"
                        error={errors.useful_life_months?.message}
                        {...register("useful_life_months", { valueAsNumber: true })}
                    />

                    {calculationMethod === "DECLINING_BALANCE" && (
                        <TextInput
                            label="Depreciation Rate (%)"
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            placeholder="20"
                            error={errors.depreciation_rate?.message}
                            {...register("depreciation_rate", { valueAsNumber: true })}
                        />
                    )}
                </div>
            </div>

            {/* Period & Status — editable */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">3</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Period & Status</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* start_date readonly */}
                    <TextInput
                        label="Start Date"
                        type="date"
                        value={detail?.start_date?.split("T")[0] ?? ""}
                        disabled
                    />
                    {/* end_date editable */}
                    <TextInput
                        label="End Date"
                        type="date"
                        error={errors.end_date?.message}
                        {...register("end_date")}
                    />
                </div>

                {/* Is Active Toggle */}
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</p>
                        <p className="text-xs text-gray-400 mt-0.5">Enable or disable this depreciation setting</p>
                    </div>
                    <Controller
                        control={control}
                        name="is_active"
                        render={({ field }) => (
                            <button
                                type="button"
                                onClick={() => field.onChange(!field.value)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                    field.value ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    field.value ? "translate-x-6" : "translate-x-1"
                                }`} />
                            </button>
                        )}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit(onSubmit, (errs) => console.log("Validation errors:", errs))}
                    disabled={isSubmitting || isPending}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>

        </section>
    )
}