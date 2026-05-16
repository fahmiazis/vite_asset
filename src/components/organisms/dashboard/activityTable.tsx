import { ArrowRight01Icon } from "hugeicons-react";

interface Transaction {
  id: string;
  date: string;
  transactionNumber: string;
  transaction: string;
  icon: string;
  iconBgColor: string;
  user: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  showSeeAll?: boolean;
  onSeeAllClick?: () => void;
  className?: string;
}

const RecentTransactions = ({
  transactions,
  showSeeAll = true,
  onSeeAllClick,
  className = '',
}: RecentTransactionsProps) => {
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">
          Recent transactions (5 Pendings)
        </h3>

        <div className="flex items-center gap-2">
          {/* Dropdown filter */}
          <select className="
            px-3 py-2 rounded-xl text-xs font-medium
            border border-gray-100 dark:border-zinc-800
            bg-white dark:bg-zinc-900
            text-gray-700 dark:text-zinc-400
            hover:bg-gray-50 dark:hover:bg-zinc-800
            transition-colors outline-none
          ">
            <option>All Status</option>
            <option>Pending</option>
            <option>Finished</option>
            <option>Rejected</option>
          </select>

          <select className="
            px-3 py-2 rounded-xl text-xs font-medium
            border border-gray-100 dark:border-zinc-800
            bg-white dark:bg-zinc-900
            text-gray-700 dark:text-zinc-400
            hover:bg-gray-50 dark:hover:bg-zinc-800
            transition-colors outline-none
          ">
            <option>All Transaction</option>
            <option>Procurement</option>
            <option>Disposal</option>
            <option>Mutation</option>
            <option>Stock Opname</option>
          </select>

          {/* See all button */}
          {showSeeAll && (
            <button
              onClick={onSeeAllClick}
              className="
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                border border-gray-100 dark:border-zinc-800
                text-gray-500 dark:text-zinc-400
                hover:bg-gray-50 dark:hover:bg-zinc-900
                transition-colors
              "
            >
              See all
              <ArrowRight01Icon className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                Transaction Number
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-50 dark:border-zinc-800/60 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {/* Date */}
                <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400">
                  {transaction.date}
                </td>

                {/* Transaction Number */}
                <td className="py-4 px-4 text-xs font-semibold text-gray-900 dark:text-zinc-50 font-mono">
                  {transaction.transactionNumber}
                </td>

                {/* Transaction with Icon */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2.5">
                    {transaction.icon ? (
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: transaction.iconBgColor || '#6366f1' }}
                      >
                        {transaction.icon}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-400 dark:text-zinc-500">?</span>
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-900 dark:text-zinc-50">
                      {transaction.transaction}
                    </span>
                  </div>
                </td>

                {/* User */}
                <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400">
                  {transaction.user}
                </td>

                {/* Status */}
                <td className="py-4 px-4 text-xs text-gray-500 dark:text-zinc-400">
                  {transaction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;