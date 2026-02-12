import { useApprovalFlowDetail } from '../../../../hooks/query/approval/detail'
import { useParams } from 'react-router-dom'
import Head from '../../../molecules/head'
import { FlowStepTable } from '../../../organisms/approval/detail'
import { useState } from 'react'
import type { FlowStep } from '../../../../models/approval/detail'
import ReorderStepModal from '../../../organisms/modals/approvalStep'

export default function ApprovalFlowDetail() {
    const { id } = useParams()

    const { data } = useApprovalFlowDetail(id || '')

    const [isModal, setIsModal] = useState(false)
    const [flowSteps, setFlowSteps] = useState<FlowStep[]>([])

    const handleSaveReorder = (reorderedIds: string[]) => {
        console.log('Reordered Step IDs:', reorderedIds)

        const reorderedSteps = reorderedIds
            .map(id => flowSteps.find(step => step.id === id))
            .filter(Boolean)
            .map((step, index) => ({
                ...step!,
                step_order: index + 1,
            }))

        setFlowSteps(reorderedSteps)
    }
    return (
        <>
            {data?.data && (
                <ReorderStepModal
                    isOpen={isModal}
                    onClose={() => setIsModal(false)}
                    flowSteps={data?.data.flow_steps}
                    onSave={handleSaveReorder}
                />
            )}
            <Head label={`Detail Approval Flow ${data?.data.flow_name}`} className='mb-4' />
            <p>other information</p>
            {data && (
                <FlowStepTable data={data?.data.flow_steps} flowId={id} switchBtn={() => setIsModal(true)} />
            )}
        </>
    )
}
