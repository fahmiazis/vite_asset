import { useHomebaseList } from '../../../hooks/query/homebase/list'
import { HomeBaseTable } from '../../organisms/homebase/table'

export default function HomebasePage() {
    const { data } = useHomebaseList()
    return (
        <>
            {data && (
                <HomeBaseTable data={data.data} />
            )}
        </>
    )
}
