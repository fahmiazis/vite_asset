import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useUserBranches } from "../../../../hooks/query/user/branches"
import { useUserHeldAssets } from "../../../../hooks/query/user/heldAssets"
import { BranchPickerModal } from "./userBranchesSection"

interface UserAssetsSectionProps {
  userId: string
  className?: string
  /** halaman profil: homebase hanya ditampilkan, tidak bisa diganti */
  readOnly?: boolean
}

/**
 * Aset yang sedang dipegang user (hasil serah terima) + homebase aktifnya.
 *
 * Aset tetap milik cabangnya (`branch_code`); aset yang cabangnya berbeda
 * dengan homebase aktif user ditandai, karena serah terima hanya bisa
 * dilakukan dari homebase yang sama dengan cabang aset.
 */
export default function UserAssetsSection({
  userId,
  className = "",
  readOnly = false,
}: UserAssetsSectionProps) {
  const { t, i18n } = useTranslation()
  const { branches, homebase, isLoading: loadingBranches } = useUserBranches(userId)
  const { assets, total, isLoading } = useUserHeldAssets(userId)
  const [showHomebase, setShowHomebase] = useState(false)

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString(i18n.language) : "-"

  return (
    <div
      className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
    >
      {showHomebase && (
        <BranchPickerModal
          mode="homebase"
          userId={userId}
          userBranches={branches}
          onClose={() => setShowHomebase(false)}
        />
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("userAsset.title")}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{t("userAsset.subtitle")}</p>
      </div>

      {/* Homebase aktif */}
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border mb-4 ${
          homebase || loadingBranches
            ? "bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900"
            : "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("userAsset.homebase")}</p>
          {loadingBranches ? (
            <p className="text-sm text-gray-400">…</p>
          ) : homebase ? (
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {homebase.branch_code} — {homebase.branch_name}
            </p>
          ) : (
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {t("userAsset.noHomebase")}
            </p>
          )}
        </div>
        {!readOnly && (
          <button
            onClick={() => setShowHomebase(true)}
            disabled={loadingBranches}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex-shrink-0 disabled:opacity-50"
          >
            {t(homebase ? "userAsset.changeHomebase" : "userAsset.setHomebase")}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">{t("userAsset.empty")}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">
            {total > assets.length
              ? t("userAsset.countPartial", { shown: assets.length, total })
              : t("userAsset.count", { count: total })}
          </p>

          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1 app-scrollbar">
            {assets.map((asset) => {
              const otherBranch = !!homebase && asset.branch_code !== homebase.branch_code
              return (
                <div
                  key={asset.id}
                  className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/dashboard/asset/${asset.asset_number}`}
                      className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                    >
                      {asset.asset_name}
                    </Link>
                    <p className="text-xs text-gray-400 truncate">
                      {asset.asset_number}
                      {asset.category_name ? ` · ${asset.category_name}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {t("userAsset.heldSince", { date: formatDate(asset.assigned_at) })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        otherBranch
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                      title={otherBranch ? t("userAsset.otherBranchHint") : undefined}
                    >
                      {t("userAsset.branch", { code: asset.branch_code })}
                    </span>
                    <span className="text-[11px] text-gray-400">{asset.asset_status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
