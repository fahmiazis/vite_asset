import { useApprovalFlowDetail } from '../../../../hooks/query/approval/detail'
import { useParams } from 'react-router-dom'
import Head from '../../../molecules/head'

export default function ApprovalFlowDetail() {
    const { id } = useParams()

    const { data } = useApprovalFlowDetail(id || '')

    console.log('detail approval flow ==>', data)
    return (
        <>
            <Head label={`Detail Approval Flow ${data?.data.flow_name}`} className='mb-4' />
            detail approval flow here
        </>
    )
}
