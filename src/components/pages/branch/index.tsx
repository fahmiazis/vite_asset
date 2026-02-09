import { useBranchList } from '../../../hooks/query/branch/list'

export default function BranchPage() {
    const { data } = useBranchList()
    console.log('data branch ==>', data)
    return (
        <div>
            u can find branch here
        </div>
    )
}
