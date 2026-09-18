import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStockOpnameList } from "../../../hooks/query/stockOpname/list"
import { StockOpnameTable } from "../../organisms/stockOpname/table"

const PAGE_SIZE = 10

export default function StockOpnamePage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useStockOpnameList({ page, limit: PAGE_SIZE })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-3xl font-bold">Stock Opname</h6>
        <button
          onClick={() => navigate("/dashboard/stock-opname/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + Buat Stock Opname
        </button>
      </div>

      <StockOpnameTable
        data={data?.data.data ?? []}
        total={data?.data.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </div>
  )
}
