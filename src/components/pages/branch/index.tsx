import { useBranchList } from '../../../hooks/query/branch/list'
import { BranchTable } from '../../organisms/branch'

export default function BranchPage() {
    const { data, isLoading } = useBranchList()
    console.log('data branch ==>', data)
    return (
        <div>
            {isLoading ? (
                <p>sabar!!.....</p>
            ) : data ? (
                <BranchTable data={data?.data} />
            ) : null}
        </div>
    )
}
