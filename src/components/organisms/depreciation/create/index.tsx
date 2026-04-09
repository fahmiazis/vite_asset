// components/organisms/depreciation/create/index.tsx

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Selects } from "../../../molecules/input/selects"
import { useCreateDepreciation } from "../../../../hooks/mutation/depreciation/create"

// ─── Schema ───────────────────────────────────────────────────────────────────

const createDepreciationSchema = z.object({
    setting_type: z.string().min(1, "Setting type is required"),
    reference_id: z.number().min(1, "Reference ID is required"),
    calculation_method: z.string().min(1, "Calculation method is required"),
    depreciation_period: z.string().min(1, "Depreciation period is required"),
    useful_life_months: z.number().min(1, "Minimum 1 month"),
    depreciation_rate: z.number().nullable().optional(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().nullable().optional(),
    is_active: z.boolean(),
})

export type CreateDepreciationFormValues = z.infer<typeof createDepreciationSchema>

// ─── Options ──────────────────────────────────────────────────────────────────

// "setting_type": ["ASSET", "CATEGORY"],
//  "calculation_method": ["DECLINING_BALANCE", "STRAIGHT_LINE"],

// cuma 2 ini aja qin

const SETTING_TYPE_OPTIONS = [
    { id: "CATEGORY", value: "CATEGORY", label: "Category" },
    { id: "ASSET", value: "ASSET", label: "Asset" },
]

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
                    ${props.disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : ""}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function CreateDepreciationPage() {
    const {
        register, control, handleSubmit, watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateDepreciationFormValues>({
        resolver: zodResolver(createDepreciationSchema),
        defaultValues: {
            setting_type: "",
            reference_id: undefined,
            calculation_method: "",
            depreciation_period: "MONTHLY",
            useful_life_months: undefined,
            depreciation_rate: null,
            start_date: "",
            end_date: null,
            is_active: true,
        },
    })

    const calculationMethod = watch("calculation_method")

    const { mutate } = useCreateDepreciation({
        redirectOnSuccess: true,
        redirectPath: "/dashboard/depreciation",
    })

    const onSubmit = (data: CreateDepreciationFormValues) => {
        mutate(data)
    }

    return (
        <section className="space-y-5 mt-4">

            {/* Setting Info */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">1</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Setting Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="setting_type"
                        render={({ field, fieldState }) => (
                            <Selects
                                label="Setting Type"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                options={SETTING_TYPE_OPTIONS}
                                placeholder="Select setting type"
                                error={fieldState.error?.message}
                                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                selectClassName="text-sm py-2"
                                required
                            />
                        )}
                    />

                    <TextInput
                        label="Reference ID"
                        type="number"
                        required
                        placeholder="1"
                        error={errors.reference_id?.message}
                        {...register("reference_id", { valueAsNumber: true })}
                    />
                </div>
            </div>

            {/* Calculation Config */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">2</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Calculation Configuration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="calculation_method"
                        render={({ field, fieldState }) => (
                            <Selects
                                label="Calculation Method"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                options={CALCULATION_METHOD_OPTIONS}
                                placeholder="Select method"
                                error={fieldState.error?.message}
                                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                selectClassName="text-sm py-2"
                                required
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="depreciation_period"
                        render={({ field, fieldState }) => (
                            <Selects
                                label="Depreciation Period"
                                value="MONTHLY"
                                onChange={() => { }}
                                options={DEPRECIATION_PERIOD_OPTIONS}
                                placeholder="Select period"
                                error={fieldState.error?.message}
                                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                selectClassName="text-sm py-2 opacity-50 cursor-not-allowed pointer-events-none"
                            />
                        )}
                    />

                    <TextInput
                        label="Useful Life (Months)"
                        type="number"
                        required
                        min={1}
                        placeholder="60"
                        error={errors.useful_life_months?.message}
                        {...register("useful_life_months", { valueAsNumber: true })}
                    />

                    {/* depreciation_rate hanya muncul kalau method DECLINING_BALANCE */}
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

            {/* Period & Status */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">3</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Period & Status</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextInput
                        label="Start Date"
                        type="date"
                        required
                        error={errors.start_date?.message}
                        {...register("start_date")}
                    />
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${field.value ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${field.value ? "translate-x-6" : "translate-x-1"
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
                    onClick={() => window.history.back()}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit(onSubmit, (errs) => console.log("Validation errors:", errs))}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                    {isSubmitting ? "Saving..." : "Save Setting"}
                </button>
            </div>

        </section>
    )
}