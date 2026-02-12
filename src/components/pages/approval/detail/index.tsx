import { useApprovalFlowDetail } from '../../../../hooks/query/approval/detail'
import { useParams } from 'react-router-dom'
import Head from '../../../molecules/head'
import { FlowStepTable } from '../../../organisms/approval/detail'

export default function ApprovalFlowDetail() {
    const { id } = useParams()

    const { data } = useApprovalFlowDetail(id || '')

    console.log('detail approval flow ==>', data)
    return (
        <>
            <Head label={`Detail Approval Flow ${data?.data.flow_name}`} className='mb-4' />
            <p>informais lain</p>
            {data && (
                <FlowStepTable data={data?.data.flow_steps}/>
            )}
        </>
    )
}
