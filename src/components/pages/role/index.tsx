import { useRoleList } from '../../../hooks/query/role/list'
import { RoleTable } from '../../organisms/role'

export default function RolePage() {
    const { data } = useRoleList()
    return (
        <>
            {data && (
                <RoleTable data={data?.data} />
            )}
        </>
    )
}
