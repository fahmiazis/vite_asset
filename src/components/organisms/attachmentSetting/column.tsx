import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { attachmentSettingState } from "../../../models/attachmentSetting/list"
import toast from "react-hot-toast"
import { Textareas } from "../../molecules/input/textAreas"
import { InputToggle } from "../../molecules/input/inputTogle"
import { useUpdateAttachmentSetting } from "../../../hooks/mutation/attachSetting/update"

export function ToggleRow({
    label,
    value,
    onChange,
}: {
    label: string
    value: boolean
    onChange: (val: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between">

            <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </p>
                <p className="text-xs text-gray-400">
                    {value ? "Enabled" : "Disabled"}
                </p>
            </div>

            <InputToggle
                checked={value}
                onChange={onChange}
            />
        </div>
    )
}

function EditModal({
    row,
    onClose,
}: {
    row: attachmentSettingState
    onClose: () => void
}) {
    const [description, setDescription] = useState(row.description || "")
    const [isRequired, setIsRequired] = useState(row.is_required)
    const [isActive, setIsActive] = useState(row.is_active)

    const { mutate, isPending } = useUpdateAttachmentSetting(row.id)
    const handleSubmit = () => {
        mutate(
            {
                description,
                is_required: isRequired,
                is_active: isActive,
            },
            {
                onSuccess: () => {
                    toast.success("Updated successfully")
                    onClose()
                },
                onError: () => {
                    toast.error("Failed to update")
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">

                <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                    Update Attachment Setting
                </h3>

                <div className="space-y-5">

                    {/* Required */}
                    <ToggleRow
                        label="Required"
                        value={isRequired}
                        onChange={setIsRequired}
                    />

                    {/* Active */}
                    <ToggleRow
                        label="Active"
                        value={isActive}
                        onChange={setIsActive}
                    />

                    {/* Description (moved to bottom) */}
                    <Textareas
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="Input description..."
                        rows={3}
                        maxLength={200}
                    />

                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
    id,
    label,
    onCancel,
}: {
    id: number
    label: string
    onCancel: () => void
}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Delete Attachment Setting
                </h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure want to delete{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">"{label}"</span>?{" "}
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        // disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    {/* <button
                        onClick={() => deleteAttachmentSetting(id)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button> */}
                </div>
            </div>
        </div>
    )
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ row }: { row: attachmentSettingState }) {
    const [showDelete, setShowDelete] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    return (
        <>
            <div className="flex items-center gap-2">
                <Link
                    to={`/dashboard/setting-attachment/${row.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Detail
                </Link>

                <button
                    onClick={() => setShowEdit(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                    Edit
                </button>

                <button
                    onClick={() => setShowDelete(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>

            {showEdit && (
                <EditModal
                    row={row}
                    onClose={() => setShowEdit(false)}
                />
            )}

            {showDelete && (
                <DeleteModal
                    id={row.id}
                    label={`${row.transaction_type} - ${row.attachment_type}`}
                    onCancel={() => setShowDelete(false)}
                />
            )}
        </>
    )
}

// ─── Columns ──────────────────────────────────────────────────────────────────

export const attachmentSettingColumns: ColumnDef<attachmentSettingState>[] = [
    {
        id: 'no',
        header: 'No',
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        size: 60,
        meta: { sticky: 'left' },
    },
    {
        accessorKey: 'transaction_type',
        header: 'Transaction Type',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('transaction_type')}</div>
        ),
    },
    {
        accessorKey: 'stage',
        header: 'Stage',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('stage')}</div>
        ),
    },
    {
        accessorKey: 'branch_code',
        header: 'Branch Code',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {row.getValue('branch_code')}
            </div>
        ),
    },
    {
        accessorKey: 'attachment_type',
        header: 'Attachment Type',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('attachment_type')}</div>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                {row.getValue('description') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'is_required',
        header: 'Required',
        cell: ({ row }) => {
            const isRequired = row.getValue('is_required') as boolean
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${isRequired
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {isRequired ? 'Required' : 'Optional'}
                </span>
            )
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('is_active') as boolean
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
    },
    {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue('created_by')}
            </div>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'))
            return (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => {
            const date = new Date(row.getValue('updated_at'))
            return (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ActionButtons row={row.original} />,
        size: 150,
        meta: { sticky: 'right' },
    },
]