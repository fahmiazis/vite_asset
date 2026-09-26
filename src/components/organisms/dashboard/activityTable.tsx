import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight01Icon } from "hugeicons-react";
import type { DashboardRecentTransaction } from "../../../models/dashboard";
import { TRANSACTION_TYPES, transactionDetailPath, transactionTypeMeta } from "../../../utils/transactionType";
import { formatStage } from "../../../utils/stage";

const MAX_ROWS = 10;

/** kelompok stage untuk filter status — sama dengan grafik alur transaksi */
const STATUS_FILTERS: Record<string, (stage: string) => boolean> = {
  in_progress: (s) => !["FINISHED", "REJECTED", "CANCELLED"].includes(s),
  finished: (s) => s === "FINISHED",
  rejected: (s) => s === "REJECTED",
  cancelled: (s) => s === "CANCELLED",
};

interface RecentTransactionsProps {
  transactions: DashboardRecentTransaction[];
  isLoading?: boolean;
  className?: string;
}

const selectClass = `
  px-3 py-2 rounded-xl text-xs font-medium
  border border-gray-100 dark:border-zinc-800
  bg-white dark:bg-zinc-900
  text-gray-700 dark:text-zinc-400
  hover:bg-gray-50 dark:hover:bg-zinc-800
  transition-colors outline-none
`;

const RecentTransactions = ({
  transactions,
  isLoading = false,
  className = '',
}: RecentTransactionsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const rows = transactions
    .filter((trx) => !type || trx.transaction_type === type)
    .filter((trx) => !status || STATUS_FILTERS[status](trx.current_stage))
    .slice(0, MAX_ROWS);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-zinc-800
        rounded-3xl p-6 shadow-sm
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">
          {t("dashboardPage.recent.title")}
        </h3>

        <div className="flex items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="">{t("dashboardPage.recent.allStatus")}</option>
            {Object.keys(STATUS_FILTERS).map((key) => (
              <option key={key} value={key}>{t(`dashboardPage.flow.${key}`)}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="">{t("dashboardPage.allTransactions")}</option>
            {Object.entries(TRANSACTION_TYPES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800">
              {["date", "transactionNumber", "transaction", "user", "stage"].map((key) => (
                <th
                  key={key}
                  className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider"
                >
                  {t(`dashboardPage.recent.column.${key}`)}
                </th>
              ))}
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-gray-500">{t("dashboardPage.loading")}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-gray-500">{t("dashboardPage.recent.empty")}</td>
              </tr>
            ) : (
              rows.map((trx) => {
                const meta = transactionTypeMeta(trx.transaction_type);
                const href = transactionDetailPath(trx.transaction_type, trx.transaction_number);

                return (
                  <tr
                    key={`${trx.transaction_type}-${trx.transaction_number}`}
                    className="border-b border-gray-50 dark:border-zinc-800/60 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                      {trx.transaction_date}
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-gray-900 dark:text-zinc-50 font-mono">
                      {trx.transaction_number}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-medium text-gray-900 dark:text-zinc-50 whitespace-nowrap">
                          {meta.label}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400">
                      {trx.created_by_name || "-"}
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                      {formatStage(trx.current_stage)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {href && (
                        <button
                          onClick={() => navigate(href)}
                          className="
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap
                            border border-gray-100 dark:border-zinc-800
                            text-gray-600 dark:text-zinc-300
                            hover:bg-gray-100 dark:hover:bg-zinc-800
                            transition-colors
                          "
                        >
                          {t("dashboardPage.recent.open")}
                          <ArrowRight01Icon className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
