import { useParams } from 'react-router-dom'
import DetailTransactionLayout from '../../../organisms/transaction/detail'
import Head from '../../../molecules/head'
import { useTransactionDetailWStage } from '../../../../hooks/query/transaction/detailWStage'

export default function DetailTransaction() {
    const { "*": id } = useParams()
    // const { data } = useTransactionDetail(id || '')
    const { data } = useTransactionDetailWStage(id || '')
    return (
        <section className='py-2'>
            <Head label={`Detail ${id}`} />
            {data && (
                <DetailTransactionLayout data={data} id={id || ""} />
            )}
        </section>
    )
}
