import { useParams } from 'react-router-dom'
import { useTransactionDetail } from '../../../../hooks/query/transaction/detail'
import DetailTransactionLayout from '../../../organisms/transaction/detail'

export default function DetailTransaction() {
    const { "*": id } = useParams()
    const { data } = useTransactionDetail(id || '')
    return (
        <>
            {data && (
                <DetailTransactionLayout data={data}/>
            )}
        </>
    )
}
