import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDisposalList } from "../../../hooks/query/disposal/list"
import { DisposalTable, type DisposalFilters } from "../../organisms/disposal/table"

const PAGE_SIZE = 10

const EMPTY_FILTERS: DisposalFilters = {
  disposal_type: "",
  status: "",
  current_stage: "",
  start_date: "",
  end_date: "",
}

export default function DisposalPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<DisposalFilters>(EMPTY_FILTERS)

  const { data, isLoading } = useDisposalList({
    page,
    limit: PAGE_SIZE,
    disposal_type: filters.disposal_type || undefined,
    status: filters.status || undefined,
    current_stage: filters.current_stage || undefined,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
  })

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
        filters={filters}
        onPageChange={setPage}
        onFiltersChange={(next) => {
          setFilters(next)
          setPage(1) // reset ke halaman 1 tiap filter berubah
        }}
        onResetFilters={() => {
          setFilters(EMPTY_FILTERS)
          setPage(1)
        }}
      />
    </div>
  )
}
