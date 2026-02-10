import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import { useParams } from 'react-router-dom'

export default function DetailMenu() {
    const { id } = useParams()

    const { data } = useMenuDetail(id || '')

    console.log('detail menu nya adalah ==>', data)
    return (
        <div>
            detail menu {id} here
        </div>
    )
}
