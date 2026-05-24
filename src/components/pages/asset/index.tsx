import { useState } from "react"
import { useAssetList } from "../../../hooks/query/asset/list"
import { AssetsTable } from "../../organisms/assest/table"

const PAGE_SIZE = 10

export default function AssetPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useAssetList({ page, limit: PAGE_SIZE, search })

  return (
    <div>
      <h6 className="text-3xl font-bold mb-4">Assets</h6>
      <AssetsTable
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