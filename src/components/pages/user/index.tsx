import { useUserList } from '../../../hooks/query/user/list'
import Head from '../../molecules/head'
import { UserTable } from '../../organisms/user/UserTable'

export default function UserPage() {
  const { data, isLoading } = useUserList()
  return (
    <>
      <Head label='User' className='mb-4' />
      <UserTable data={data?.data || []} isLoading={isLoading} />
    </>
  )
}
