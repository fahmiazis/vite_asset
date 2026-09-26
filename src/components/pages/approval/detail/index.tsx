import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApprovalFlowDetail } from '../../../../hooks/query/approval/detail'
import { useUpdateFlowStep } from '../../../../hooks/mutation/approval/useUpdateApprovalStep'
import { useDeleteFlowStep } from '../../../../hooks/mutation/approval/useDeleteApprovalStep'
import Head from '../../../molecules/head'
import { FlowStepTable } from '../../../organisms/approval/detail'
import EditStepModal from '../../../organisms/approval/detail/editStepModal'
import ReorderStepModal from '../../../organisms/modals/approvalStep'
import type { FlowStep } from '../../../../models/approval/detail'

export default function ApprovalFlowDetail() {
    const { id } = useParams()
    const { t } = useTranslation()

    const { data, isLoading } = useApprovalFlowDetail(id || '')
    const flow = data?.data

    const updateStep = useUpdateFlowStep(id || '')
    const deleteStep = useDeleteFlowStep(id || '')

    const [isReorderOpen, setIsReorderOpen] = useState(false)
    const [stepToEdit, setStepToEdit] = useState<FlowStep | null>(null)
    const [stepToDelete, setStepToDelete] = useState<FlowStep | null>(null)

    const handlers = useMemo(
        () => ({
            onEdit: (step: FlowStep) => setStepToEdit(step),
            onDelete: (step: FlowStep) => setStepToDelete(step),
            // Toggle langsung kirim PUT — field lain tidak ikut, jadi tidak ketimpa
            onToggleVisible: (step: FlowStep, isVisible: boolean) =>
                updateStep.mutate({ stepId: step.id, data: { is_visible: isVisible } }),
            isMutating: updateStep.isPending,
        }),
        [updateStep]
    )

    const info = flow
        ? [
            { label: t('approvalDetail.info.flowCode'), value: flow.flow_code },
            { label: t('approvalDetail.info.approvalWay'), value: flow.approval_way || '-' },
            { label: t('approvalDetail.info.assignmentType'), value: flow.assignment_type || '-' },
            { label: t('approvalDetail.info.stepCount'), value: `${flow.flow_steps?.length ?? 0}` },
            {
                label: t('approvalDetail.info.status'),
                value: flow.is_active
                    ? t('approvalDetail.info.active')
                    : t('approvalDetail.info.inactive'),
            },
            {
                label: t('approvalDetail.info.customizable'),
                value: flow.is_customizable ? t('approvalDetail.yes') : t('approvalDetail.no'),
            },
        ]
        : []

    return (
        <>
            {flow && isReorderOpen && (
                <ReorderStepModal
                    isOpen={isReorderOpen}
                    onClose={() => setIsReorderOpen(false)}
                    flowSteps={flow.flow_steps}
                />
            )}

            {stepToEdit && (
                <EditStepModal
                    step={stepToEdit}
                    isPending={updateStep.isPending}
                    onClose={() => setStepToEdit(null)}
                    onSubmit={(payload) =>
                        updateStep.mutate(
                            { stepId: stepToEdit.id, data: payload },
                            { onSuccess: () => setStepToEdit(null) }
                        )
                    }
                />
            )}

            {stepToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-gray-900 opacity-50"
                        onClick={() => setStepToDelete(null)}
                    />
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {t('approvalDetail.deleteModal.title')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('approvalDetail.deleteModal.desc', { name: stepToDelete.step_name })}
                        </p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setStepToDelete(null)}
                                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {t('approvalDetail.deleteModal.cancel')}
                            </button>
                            <button
                                onClick={() =>
                                    deleteStep.mutate(stepToDelete.id, {
                                        onSuccess: () => setStepToDelete(null),
                                    })
                                }
                                disabled={deleteStep.isPending}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {deleteStep.isPending
                                    ? t('approvalDetail.deleteModal.deleting')
                                    : t('approvalDetail.deleteModal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Head
                label={`${t('approvalDetail.title')}${flow?.flow_name ? ` — ${flow.flow_name}` : ''}`}
                className='mb-4'
            />

            {flow && (
                <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {info.map((item) => (
                            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                    {flow.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-400 mb-1">
                                {t('approvalDetail.info.description')}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{flow.description}</p>
                        </div>
                    )}
                </div>
            )}

            <FlowStepTable
                data={flow?.flow_steps ?? []}
                isLoading={isLoading}
                flowId={id}
                switchBtn={() => setIsReorderOpen(true)}
                handlers={handlers}
            />
        </>
    )
}
