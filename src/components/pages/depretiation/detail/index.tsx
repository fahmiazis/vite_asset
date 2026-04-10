import { useDepreDetail } from '../../../../hooks/query/depreciation/detail'
import { useParams, useNavigate } from 'react-router-dom'
import type { detailDepreState } from '../../../../models/depreciation/detail'

function formatDate(dateStr: string | null) {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
    })
}

function Badge({ children, variant }: { children: React.ReactNode; variant: "indigo" | "gray" | "green" | "red" }) {
    const styles = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
        gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
        red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    }
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${styles[variant]}`}>
            {children}
        </span>
    )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
            <div className="text-sm text-gray-800 dark:text-gray-200">{value ?? "-"}</div>
        </div>
    )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
            </div>
            <div className="px-6 divide-y divide-gray-100 dark:divide-gray-800">
                {children}
            </div>
        </div>
    )
}

export default function DetailDeprePage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: res, isLoading } = useDepreDetail(id || '')
    const data: detailDepreState | undefined = res?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading detail...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-sm text-red-500">Failed to load depreciation detail.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Back
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {data.reference_value}
                        </h1>
                        <p className="text-xs text-gray-400">Depreciation Detail — ID #{data.id}</p>
                    </div>
                </div>
                <Badge variant={data.is_active ? "green" : "red"}>
                    {data.is_active ? "Active" : "Inactive"}
                </Badge>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <DetailSection title="General Information">
                    <DetailRow label="Reference" value={data.reference_value} />
                    <DetailRow label="Reference ID" value={data.reference_id} />
                    <DetailRow
                        label="Setting Type"
                        value={<Badge variant="indigo">{data.setting_type}</Badge>}
                    />
                    <DetailRow
                        label="Calculation Method"
                        value={<Badge variant="gray">{data.calculation_method}</Badge>}
                    />
                </DetailSection>

                {/* Depreciation Info */}
                <DetailSection title="Depreciation Info">
                    <DetailRow label="Period" value={data.depreciation_period} />
                    <DetailRow label="Useful Life" value={`${data.useful_life_months} months`} />
                    <DetailRow
                        label="Depreciation Rate"
                        value={
                            data.depreciation_rate != null
                                ? <span className="text-orange-600 dark:text-orange-400 font-medium">{data.depreciation_rate}%</span>
                                : "-"
                        }
                    />
                </DetailSection>

                {/* Period */}
                <DetailSection title="Period">
                    <DetailRow label="Start Date" value={formatDate(data.start_date)} />
                    <DetailRow label="End Date" value={formatDate(data.end_date)} />
                </DetailSection>

                {/* Timestamps */}
                <DetailSection title="Timestamps">
                    <DetailRow label="Created At" value={formatDate(data.created_at)} />
                    <DetailRow label="Updated At" value={formatDate(data.updated_at)} />
                </DetailSection>
            </div>
        </div>
    )
}