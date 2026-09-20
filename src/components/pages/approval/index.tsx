import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useApprovalFlowList } from "../../../hooks/query/approval/list"
import { useDeleteApprovalFlow } from "../../../hooks/mutation/approval/useDeleteApprovalFlow"
import Head from "../../molecules/head"
import { ApprovalFlowTable } from "../../organisms/approval"
import type { approvalListState } from "../../../models/approval/list"

export default function ApprovalPage() {
    const { t } = useTranslation()
    const { data, isLoading } = useApprovalFlowList()
    const deleteFlow = useDeleteApprovalFlow()

    const [flowToDelete, setFlowToDelete] = useState<approvalListState | null>(null)

    const handlers = useMemo(
        () => ({ onDelete: (flow: approvalListState) => setFlowToDelete(flow) }),
        []
    )

    return (
        <>
            {flowToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-gray-900 opacity-50"
                        onClick={() => setFlowToDelete(null)}
                    />
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {t('approvalList.deleteModal.title')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('approvalList.deleteModal.desc', {
                                name: flowToDelete.flow_name,
                                code: flowToDelete.flow_code,
                            })}
                        </p>
                        <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                            {t('approvalList.deleteModal.warning')}
                        </p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setFlowToDelete(null)}
                                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {t('approvalList.deleteModal.cancel')}
                            </button>
                            <button
                                onClick={() =>
                                    deleteFlow.mutate(flowToDelete.id, {
                                        onSuccess: () => setFlowToDelete(null),
                                    })
                                }
                                disabled={deleteFlow.isPending}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {deleteFlow.isPending
                                    ? t('approvalList.deleteModal.deleting')
                                    : t('approvalList.deleteModal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Head label={t('approvalList.title')} className="mb-4" />
            <ApprovalFlowTable
                data={data?.data ?? []}
                isLoading={isLoading}
                handlers={handlers}
            />
        </>
    )
}
