import { useApprovalFlowList } from "../../../hooks/query/approval/list"
import Head from "../../molecules/head"
import { ApprovalFlowTable } from "../../organisms/approval"

export default function ApprovalPage() {
    const { data } = useApprovalFlowList()
    return (
        <>
        <Head label="Approval Flow" className="mb-4"/>
            {data && (
                <ApprovalFlowTable data={data?.data} />
            )}
        </>
    )
}
