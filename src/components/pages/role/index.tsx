import { useRoleList } from '../../../hooks/query/role/list'
import Head from '../../molecules/head'
import { RoleTable } from '../../organisms/role'

export default function RolePage() {
    const { data } = useRoleList()
    return (
        <>
            <Head label='Role' className='mb-4' />
            {data && (
                <RoleTable data={data?.data} />
            )}
        </>
    )
}
