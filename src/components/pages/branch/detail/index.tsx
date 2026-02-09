import { useParams } from "react-router-dom"
import { useBranchDetail } from "../../../../hooks/query/branch/detail"

export default function DetailBranchPage() {
    const { id } = useParams()

    const { data } = useBranchDetail(id || '')
    console.log('detail branch here ==>', data)
    return (
        <div>
            detail branch page here
        </div>
    )
}
