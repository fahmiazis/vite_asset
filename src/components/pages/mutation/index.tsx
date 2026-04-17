import { useMutationList } from '../../../hooks/query/mutation/list'
import Head from '../../molecules/head'
import { MutationTable } from '../../organisms/mutation/table'

export default function MutationPage() {
  const { data } = useMutationList()
  console.log('mutation data ==>', data)
  return (
    <div>
      <Head label='Mutation List' className='mb-4'/>
      {data && (
        <MutationTable data={data.data.data}/>
      )}
    </div>
  )
}
