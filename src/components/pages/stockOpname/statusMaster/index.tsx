import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStockOpnamePhysicalStatusMasters } from "../../../../hooks/query/stockOpname/physicalStatusMasterList"
import { useStockOpnameConditionMasters } from "../../../../hooks/query/stockOpname/conditionMasterList"
import { PhysicalStatusMasterTable } from "../../../organisms/stockOpname/statusMaster/physicalStatusTable"
import { ConditionMasterTable } from "../../../organisms/stockOpname/statusMaster/conditionTable"

type Tab = "physical-status" | "condition"

export default function StockOpnameStatusMasterPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("physical-status")

  const { data: physicalStatusData, isLoading: isPhysicalStatusLoading } = useStockOpnamePhysicalStatusMasters()
  const { data: conditionData, isLoading: isConditionLoading } = useStockOpnameConditionMasters()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h6 className="text-3xl font-bold">Master Data Status Stock Opname</h6>
          <p className="text-sm text-gray-400 mt-1">
            Tambah status fisik/kondisi baru di sini supaya bisa dipakai saat isi temuan stock opname.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/stock-opname")}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Kembali
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-4">
        <button
          onClick={() => setTab("physical-status")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "physical-status"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Status Fisik
        </button>
        <button
          onClick={() => setTab("condition")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "condition"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Kondisi
        </button>
      </div>

      {tab === "physical-status" ? (
        <PhysicalStatusMasterTable data={physicalStatusData?.data ?? []} isLoading={isPhysicalStatusLoading} />
      ) : (
        <ConditionMasterTable data={conditionData?.data ?? []} isLoading={isConditionLoading} />
      )}
    </div>
  )
}
