import { useParams } from "react-router-dom"
import { useBranchDetail } from "../../../../hooks/query/branch/detail"
import { DetailBranchCard } from "../../../organisms/branch/detail/cardDetail"

export default function DetailBranchPage() {
    const { id } = useParams()

    const { data } = useBranchDetail(id || '')
    return (
        <>
           {data && (
            <DetailBranchCard data={data.data}/>
           )}
        </>
    )
}
