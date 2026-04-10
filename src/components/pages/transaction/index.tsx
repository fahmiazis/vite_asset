import TransaksiHeader from '../../organisms/transaction/head'
import StatCards from '../../organisms/transaction/statCard'
import { TransaksiTable } from '../../organisms/transaction/table'
import { useTransactionList } from '../../../hooks/query/transaction/list'

export default function TransactionPage() {
  const { data } = useTransactionList()
  return (
    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl'>
      <TransaksiHeader />
      <StatCards />
      {data && (
        <TransaksiTable data={data?.data.data} />
      )}
    </div>
  )
}