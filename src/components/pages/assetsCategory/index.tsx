import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Head from "../../molecules/head"
import { useAssetsCategoryList } from "../../../hooks/query/assetsCategory/list"
import { useDeleteAssetsCategory } from "../../../hooks/mutation/assetsCategory"
import type { assetsCategoryListState } from "../../../models/assetsCategory/list"

/**
 * Master kategori aset.
 *
 * Kategori dipakai sebagai acuan pengaturan penyusutan: baris
 * depreciation_settings dengan setting_type = 'CATEGORY' menunjuk ke id
 * kategori lewat reference_id. Karena itu menghapus kategori bisa membuat
 * pengaturan penyusutannya menggantung — lihat peringatan di modal hapus.
 */
export default function AssetsCategoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading } = useAssetsCategoryList()
  const deleteCategory = useDeleteAssetsCategory()

  const [search, setSearch] = useState("")
  const [toDelete, setToDelete] = useState<assetsCategoryListState | null>(null)

  const categories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    const rows = data?.data ?? []
    if (!keyword) return rows

    return rows.filter(
      (row) =>
        row.category_code?.toLowerCase().includes(keyword) ||
        row.category_name?.toLowerCase().includes(keyword)
    )
  }, [data, search])

  // header tabel tetap dirender walau data kosong
  const columns = [
    { key: "no", label: t("assetCategory.column.no"), className: "w-16 text-center" },
    { key: "code", label: t("assetCategory.column.code") },
    { key: "name", label: t("assetCategory.column.name") },
    { key: "description", label: t("assetCategory.column.description") },
    { key: "status", label: t("assetCategory.column.status") },
    { key: "actions", label: t("assetCategory.column.actions"), className: "text-right" },
  ]

  return (
    <>
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={() => !deleteCategory.isPending && setToDelete(null)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t("assetCategory.deleteModal.title")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("assetCategory.deleteModal.desc", {
                name: toDelete.category_name,
                code: toDelete.category_code,
              })}
            </p>
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              {t("assetCategory.deleteModal.warning")}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleteCategory.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {t("assetCategory.cancel")}
              </button>
              <button
                onClick={() =>
                  deleteCategory.mutate(toDelete.id, {
                    onSuccess: () => setToDelete(null),
                  })
                }
                disabled={deleteCategory.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteCategory.isPending
                  ? t("assetCategory.deleteModal.deleting")
                  : t("assetCategory.deleteModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <Head label={t("assetCategory.title")} className="mb-4" />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("assetCategory.searchPlaceholder")}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm w-full"
        />
        <button
          onClick={() => navigate("/dashboard/asset-category/create")}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          {t("assetCategory.create")}
        </button>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap ${
                    column.className ?? ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400">
                    {search.trim()
                      ? t("assetCategory.emptySearch")
                      : t("assetCategory.empty")}
                  </p>
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {category.category_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {category.category_name}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        category.is_active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {category.is_active
                        ? t("assetCategory.active")
                        : t("assetCategory.inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/asset-category/${category.id}/update`)
                        }
                        className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                      >
                        {t("assetCategory.edit")}
                      </button>
                      <button
                        onClick={() => setToDelete(category)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        {t("assetCategory.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
