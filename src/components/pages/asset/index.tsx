import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAssetList, useAssetViewableBranches } from "../../../hooks/query/asset/list"
import { useAssetsCategoryList } from "../../../hooks/query/assetsCategory/list"
import { assetStatuses } from "../../../constans/asset"
import { AssetsTable } from "../../organisms/assest/table"
import { PageSizeSelect } from "../../molecules/table/pageSize"

// Dipaging server; backend membatasi limit maksimal 100 (dto.AssetListFilter),
// jadi tidak ada opsi "Semua" di sini.
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

const selectClass =
  "px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[220px]"

export default function AssetPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [assetStatus, setAssetStatus] = useState("")
  const [branchCode, setBranchCode] = useState("")

  // Semua filter diterapkan di server (GET /assets) — tabelnya paginasi,
  // jadi menyaring baris yang sedang tampil saja akan menipu.
  const { data, isLoading } = useAssetList({
    page,
    limit: pageSize,
    search,
    assetStatus,
    branchCode,
    categoryId: categoryId ? Number(categoryId) : undefined,
  })

  const { data: categoryData } = useAssetsCategoryList()
  // hanya cabang yang boleh dilihat user — sama dengan pembatasan data di
  // backend (GET /assets), jadi dropdown tidak menawarkan cabang yang pasti kosong
  const { data: branches = [] } = useAssetViewableBranches()

  // ganti filter apa pun → kembali ke halaman pertama
  const applyFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  const hasFilter = !!(categoryId || assetStatus || branchCode)

  const filters = (
    <>
      <select
        value={categoryId}
        onChange={(e) => applyFilter(setCategoryId)(e.target.value)}
        className={selectClass}
        aria-label={t("assetFilter.category")}
      >
        <option value="">{t("assetFilter.allCategories")}</option>
        {(categoryData?.data ?? []).map((category) => (
          <option key={category.id} value={category.id}>
            {category.category_code} — {category.category_name}
          </option>
        ))}
      </select>

      <select
        value={assetStatus}
        onChange={(e) => applyFilter(setAssetStatus)(e.target.value)}
        className={selectClass}
        aria-label={t("assetFilter.status")}
      >
        <option value="">{t("assetFilter.allStatuses")}</option>
        {assetStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={branchCode}
        onChange={(e) => applyFilter(setBranchCode)(e.target.value)}
        className={selectClass}
        aria-label={t("assetFilter.branch")}
      >
        <option value="">{t("assetFilter.allBranches")}</option>
        {branches.map((branch) => (
          <option key={branch.branch_code} value={branch.branch_code}>
            {branch.branch_code} — {branch.branch_name}
          </option>
        ))}
      </select>

      {hasFilter && (
        <button
          onClick={() => {
            setCategoryId("")
            setAssetStatus("")
            setBranchCode("")
            setPage(1)
          }}
          className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {t("assetFilter.reset")}
        </button>
      )}
    </>
  )

  return (
    <div>
      <h6 className="text-3xl font-bold mb-4">Assets</h6>
      <AssetsTable
        data={data?.data.data ?? []}
        total={data?.data.total ?? 0}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={setPage}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1) // reset ke page 1 waktu search berubah
        }}
        filters={filters}
        pageSizeControl={
          <PageSizeSelect
            value={pageSize}
            options={PAGE_SIZE_OPTIONS}
            allowAll={false}
            onChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        }
      />
    </div>
  )
}
