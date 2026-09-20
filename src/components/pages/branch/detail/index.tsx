import { useParams } from "react-router-dom"
import { useBranchDetail } from "../../../../hooks/query/branch/detail"
import { DetailBranchCard } from "../../../organisms/branch/detail/cardDetail"
import { BranchMembersPanel } from "../../../organisms/branch/detail/branchMembersPanel"

export default function DetailBranchPage() {
    const { id } = useParams()

    const { data, isLoading } = useBranchDetail(id || '')

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
            </div>
        )
    }

    if (!data?.data) return null

    const branch = data.data
    const branchName = `${branch.branch_code} — ${branch.branch_name}`

    return (
        <section className="space-y-4">
            <DetailBranchCard data={branch} />

            {/* Homebase: menentukan kode cabang pada nomor transaksi user */}
            <BranchMembersPanel
                branchId={branch.id}
                branchName={branchName}
                variant="homebase"
            />

            {/* Assignment: akses tambahan, satu user boleh di banyak cabang */}
            <BranchMembersPanel
                branchId={branch.id}
                branchName={branchName}
                variant="assignment"
            />
        </section>
    )
}
