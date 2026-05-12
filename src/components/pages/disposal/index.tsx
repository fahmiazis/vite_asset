import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDisposalList } from "../../../hooks/query/disposal/list"
import { DisposalTable } from "../../organisms/disposal/table"

const PAGE_SIZE = 10

export default function DisposalPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useDisposalList({ page, limit: PAGE_SIZE, search })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-3xl font-bold">Disposal</h6>
        <button
          onClick={() => navigate("/dashboard/disposal/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + Buat Disposal
        </button>
      </div>

      <DisposalTable
        data={data?.data.data ?? []}
        total={data?.data.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={setPage}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1) // reset ke page 1 waktu search berubah
        }}
      />
    </div>
  )
}