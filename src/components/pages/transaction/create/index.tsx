import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Selects } from "../../../molecules/input/selects"
import { CABANG_OPTIONS, KATEGORI_OPTIONS } from "../../../organisms/transaction/create/dataDummy"
import { procurementSchema, type ProcurementFormValues } from "../../../organisms/transaction/create/validation"
import { useCreateProcurement } from "../../../../hooks/mutation/transaction/create"

// ─── Rupiah masking helpers ───────────────────────────────────────────────────
function toRupiah(num: number): string {
    if (!num) return ""
    return new Intl.NumberFormat("id-ID").format(num)
}
function fromRupiah(str: string): number {
    return Number(str.replace(/\./g, "").replace(/,/g, "")) || 0
}

// ─── Rupiah Input ─────────────────────────────────────────────────────────────
function RupiahInput({
    value,
    onChange,
    error,
    label,
    placeholder = "0",
}: {
    value: number
    onChange: (v: number) => void
    error?: string
    label: string
    placeholder?: string
}) {
    const [display, setDisplay] = useState(value ? toRupiah(value) : "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, "")
        const num = Number(raw) || 0
        setDisplay(raw ? toRupiah(num) : "")
        onChange(num)
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none select-none">
                    Rp
                </span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={display}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${error
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        }
            bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100`}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ─── Simple text input ────────────────────────────────────────────────────────
function TextInput({
    label,
    error,
    required,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
    required?: boolean
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                {...props}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors
          ${error
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    }
          bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100
          ${props.disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : ""}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ─── Detail Row (nested inside item) ─────────────────────────────────────────
function DetailFields({
    itemIndex,
    detailIndex,
    control,
    register,
    errors,
    onRemove,
}: {
    itemIndex: number
    detailIndex: number
    control: any
    register: any
    errors: any
    onRemove: () => void
}) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Penerima #{detailIndex + 1}</span>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-xs text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded px-2 py-0.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                    Hapus
                </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
                <TextInput
                    label="Nama pemohon"
                    required
                    placeholder="Budi Santoso"
                    error={errors?.items?.[itemIndex]?.details?.[detailIndex]?.requester_name?.message}
                    {...register(`items.${itemIndex}.details.${detailIndex}.requester_name`)}
                />
                <Controller
                    control={control}
                    name={`items.${itemIndex}.details.${detailIndex}.branch_code`}
                    render={({ field, fieldState }) => (
                        <Selects
                            label="Kode cabang"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            options={CABANG_OPTIONS}
                            placeholder="Pilih cabang"
                            error={fieldState.error?.message}
                            labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            selectClassName="text-sm py-2"
                        />
                    )}
                />
                <TextInput
                    label="Kuantitas"
                    type="number"
                    required
                    min={1}
                    placeholder="1"
                    error={errors?.items?.[itemIndex]?.details?.[detailIndex]?.quantity?.message}
                    {...register(`items.${itemIndex}.details.${detailIndex}.quantity`, {
                        valueAsNumber: true,
                    })}
                />
            </div>
            <TextInput
                label="Catatan"
                placeholder="Kebutuhan khusus..."
                error={errors?.items?.[itemIndex]?.details?.[detailIndex]?.notes?.message}
                {...register(`items.${itemIndex}.details.${detailIndex}.notes`)}
            />
        </div>
    )
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({
    itemIndex,
    control,
    register,
    errors,
    onRemove,
    watch,
}: {
    itemIndex: number
    control: any
    register: any
    errors: any
    onRemove: () => void
    watch: any
}) {
    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
        control,
        name: `items.${itemIndex}.details`,
    })

    const [showDetails, setShowDetails] = useState(false)

    // Realtime qty validation
    const itemQty = useWatch({ control, name: `items.${itemIndex}.quantity` }) || 0
    const details = useWatch({ control, name: `items.${itemIndex}.details` }) || []
    const totalDetailQty = details.reduce((sum: number, d: any) => sum + (Number(d?.quantity) || 0), 0)
    const isQtyExceeded = totalDetailQty > itemQty

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Item header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                        {itemIndex + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {watch(`items.${itemIndex}.item_name`) || `Item #${itemIndex + 1}`}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-md px-2.5 py-1 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                    Hapus item
                </button>
            </div>

            <div className="p-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/30">
                {/* Row 1: nama + kategori */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <TextInput
                            label="Nama item"
                            required
                            placeholder="Toyota Avanza 2026"
                            error={errors?.items?.[itemIndex]?.item_name?.message}
                            {...register(`items.${itemIndex}.item_name`)}
                        />
                    </div>
                    <Controller
                        control={control}
                        name={`items.${itemIndex}.category_id`}
                        render={({ field, fieldState }) => (
                            <Selects
                                label="Kategori"
                                value={field.value ?? ""}
                                onChange={(v) => field.onChange(Number(v))}
                                options={KATEGORI_OPTIONS}
                                placeholder="Pilih kategori"
                                error={fieldState.error?.message}
                                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                selectClassName="text-sm py-2"
                                required
                            />
                        )}
                    />
                </div>

                {/* Row 2: qty + harga + cabang */}
                <div className="grid grid-cols-3 gap-3">
                    <TextInput
                        label="Kuantitas"
                        type="number"
                        required
                        min={1}
                        placeholder="1"
                        error={errors?.items?.[itemIndex]?.quantity?.message}
                        {...register(`items.${itemIndex}.quantity`, { valueAsNumber: true })}
                    />
                    <Controller
                        control={control}
                        name={`items.${itemIndex}.unit_price`}
                        render={({ field, fieldState }) => (
                            <RupiahInput
                                label="Harga satuan"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={`items.${itemIndex}.branch_code`}
                        render={({ field, fieldState }) => (
                            <Selects
                                label="Kode cabang"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                options={CABANG_OPTIONS}
                                placeholder="Pilih cabang"
                                error={fieldState.error?.message}
                                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                selectClassName="text-sm py-2"
                                required
                            />
                        )}
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catatan item
                    </label>
                    <input
                        type="text"
                        placeholder="Untuk operasional cabang..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        {...register(`items.${itemIndex}.notes`)}
                    />
                </div>

                {/* Detail section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDetails((p) => !p)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900"
                            >
                                <span className={`transition-transform ${showDetails ? "rotate-90" : ""}`}>›</span>
                                Detail penerima
                                {detailFields.length > 0 && (
                                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                                        {detailFields.length}
                                    </span>
                                )}
                            </button>
                            <span className="text-xs text-gray-400">(opsional)</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Qty counter realtime */}
                            {detailFields.length > 0 && (
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${isQtyExceeded
                                    ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                                    : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                    }`}>
                                    {isQtyExceeded ? "⚠" : "✓"}
                                    &nbsp;{totalDetailQty} / {itemQty} unit teralokasi
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    appendDetail({ branch_code: "", quantity: 1, requester_name: "", notes: "" })
                                    setShowDetails(true)
                                }}
                                className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                + Tambah penerima
                            </button>
                        </div>
                    </div>

                    {/* Exceeded warning */}
                    {isQtyExceeded && (
                        <div className="mb-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            <span>Total kuantitas detail ({totalDetailQty}) melebihi kuantitas item ({itemQty}). Harap sesuaikan.</span>
                        </div>
                    )}

                    {/* Detail fields list */}
                    {showDetails && (
                        <div className="space-y-3">
                            {detailFields.map((detail, detailIndex) => (
                                <DetailFields
                                    key={detail.id}
                                    itemIndex={itemIndex}
                                    detailIndex={detailIndex}
                                    control={control}
                                    register={register}
                                    errors={errors}
                                    onRemove={() => removeDetail(detailIndex)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function CreateTransactionPage() {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProcurementFormValues>({
        resolver: zodResolver(procurementSchema),
        defaultValues: {
            transaction_date: new Date().toISOString().split("T")[0],
            notes: "",
            items: [
                {
                    item_name: "",
                    category_id: undefined,
                    quantity: 1,
                    unit_price: 0,
                    branch_code: "",
                    notes: "",
                    details: [],
                },
            ],
        },
    })

    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control,
        name: "items",
    })

    // Summary calculation
    const watchedItems = useWatch({ control, name: "items" }) || []
    const totalUnit = watchedItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
    const totalNilai = watchedItems.reduce(
        (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unit_price) || 0),
        0
    )

    const { mutate, isPending } = useCreateProcurement({
        redirectOnSuccess: true,
        redirectPath: '/dashboard/procurement',
    });

    // Ganti bagian onSubmit
    const onSubmit = (data: ProcurementFormValues) => {
        // mutate({
        //     transaction_date: data.transaction_date,
        //     notes: data.notes ?? "",
        //     items: data.items.map((item) => ({
        //         item_name: item.item_name,
        //         category_id: item.category_id,
        //         quantity: item.quantity,
        //         unit_price: item.unit_price,
        //         branch_code: item.branch_code,
        //         notes: item.notes ?? "",
        //         details: item.details?.map((d) => ({
        //             branch_code: d.branch_code,
        //             quantity: d.quantity,
        //             requester_name: d.requester_name,
        //             notes: d.notes ?? "",
        //         })),
        //     })),
        // })
        console.log({
            transaction_date: data.transaction_date,
            notes: data.notes ?? "",
            items: data.items.map((item) => ({
                item_name: item.item_name,
                category_id: item.category_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                branch_code: item.branch_code,
                notes: item.notes ?? "",
                details: item.details?.map((d) => ({
                    branch_code: d.branch_code,
                    quantity: d.quantity,
                    requester_name: d.requester_name,
                    notes: d.notes ?? "",
                })),
            })),
        })
    }

    return (
        <section className="space-y-5 mt-4">

            {/* Section 1: Header Transaksi */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">1</div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Informasi transaksi</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextInput
                        label="Tanggal transaksi"
                        type="date"
                        required
                        error={errors.transaction_date?.message}
                        {...register("transaction_date")}
                    />
                    {/* transaction_type bisa ditambah kalau ada endpoint-nya */}
                    <div className="opacity-0 pointer-events-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catatan transaksi
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Pengadaan kendaraan operasional Q1 2026..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                        {...register("notes")}
                    />
                </div>
            </div>

            {/* Section 2: Items */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">2</div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daftar item</h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">
                            {itemFields.length} item
                        </span>
                    </div>
                </div>

                {errors.items?.root && (
                    <p className="text-xs text-red-500 mb-3">{errors.items.root.message}</p>
                )}

                <div className="space-y-4">
                    {itemFields.map((field, index) => (
                        <ItemCard
                            key={field.id}
                            itemIndex={index}
                            control={control}
                            register={register}
                            errors={errors}
                            watch={watch}
                            onRemove={() => removeItem(index)}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        appendItem({
                            item_name: "",
                            category_id: undefined as any,
                            quantity: 1,
                            unit_price: 0,
                            branch_code: "",
                            notes: "",
                            details: [],
                        })
                    }
                    className="mt-4 w-full py-2.5 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors flex items-center justify-center gap-1.5"
                >
                    <span className="text-base leading-none">+</span> Tambah item
                </button>
            </div>

            {/* Summary + Actions */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
                <div className="flex gap-8">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total item</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {itemFields.length} jenis &middot; {totalUnit} unit
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total nilai</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalNilai)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    >
                        Simpan draft
                    </button>
                    <button
                        onClick={() => handleSubmit(onSubmit)}
                        disabled={isPending}
                        className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                    >
                        {isPending ? "Mengirim..." : "Submit pengadaan"}
                    </button>
                </div>
            </div>

        </section>
    )
}