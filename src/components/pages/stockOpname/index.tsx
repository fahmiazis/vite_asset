import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useStockOpnameList } from "../../../hooks/query/stockOpname/list"
import { StockOpnameTable } from "../../organisms/stockOpname/table"

const PAGE_SIZE = 10

export default function StockOpnamePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useStockOpnameList({ page, limit: PAGE_SIZE })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-3xl font-bold">{t("stockOpnamePage.title")}</h6>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/stock-opname/report")}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t("stockOpnamePage.reportButton", "Report")}
          </button>
          <button
            onClick={() => navigate("/dashboard/stock-opname/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            {t("stockOpnamePage.createButton")}
          </button>
        </div>
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
