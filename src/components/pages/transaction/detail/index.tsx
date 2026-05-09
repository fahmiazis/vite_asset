import { useParams } from 'react-router-dom'
import DetailTransactionLayout from '../../../organisms/transaction/detail'
import Head from '../../../molecules/head'
import { useTransactionDetailWStage } from '../../../../hooks/query/transaction/detailWStage'
import { DetailTransactionSkeleton } from '../../../organisms/transaction/detail/skeleton'

export default function DetailTransaction() {
    const { "*": id } = useParams()
    // const { data } = useTransactionDetail(id || '')
    const { data, isLoading } = useTransactionDetailWStage(id || '')
    return (
        <section className='py-2'>
            <Head label={`Detail ${id}`} />
            {isLoading ? (
                <DetailTransactionSkeleton />
            ) : data ? (
                <DetailTransactionLayout data={data} />
            ) : null}
        </section>
    )
}
