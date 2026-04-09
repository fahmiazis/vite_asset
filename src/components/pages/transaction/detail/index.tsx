import { useParams } from 'react-router-dom'
import { useTransactionDetail } from '../../../../hooks/query/transaction/detail'
import DetailTransactionLayout from '../../../organisms/transaction/detail'
import Head from '../../../molecules/head'

export default function DetailTransaction() {
    const { "*": id } = useParams()
    const { data } = useTransactionDetail(id || '')
    return (
        <section className='py-2'>
            <Head label={`Detail ${id}`}/>
            {data && (
                <DetailTransactionLayout data={data}/>
            )}
        </section>
    )
}
