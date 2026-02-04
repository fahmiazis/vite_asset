import { useUserList } from '../../../hooks/query/user/list'
import { UserTable } from '../../organisms/user/UserTable'

export default function UserPage() {
  const { data, isLoading } = useUserList()
  return (
      <UserTable data={data?.data || []} isLoading={isLoading} />
  )
}
