import { useNavigate } from 'react-router-dom'
import { useRoleList } from '../../../hooks/query/role/list'
import { RoleTable } from '../../organisms/role'

export default function RolePage() {
    const { data } = useRoleList()
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/dashboard/role/create')
    }
    return (
        <>
            <div className='cursor-pointer' onClick={handleNavigate}>klik yang ini coba</div>
            {data && (
                <RoleTable data={data?.data} />
            )}
        </>
    )
}
