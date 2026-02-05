import { ArrowRight01Icon } from "hugeicons-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  paymentName: string;
  icon?: string;
  iconBgColor?: string;
  method: string;
  category: string;
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
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent transactions</h3>
        
        <div className="flex items-center gap-3">
          {/* Dropdown filter */}
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <option>All accounts</option>
            <option>Checking</option>
            <option>Savings</option>
            <option>Credit Card</option>
          </select>

          {/* See all button */}
          {showSeeAll && (
            <button
              onClick={onSeeAllClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              See all
              <ArrowRight01Icon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {/* Date */}
                <td className="py-4 px-4 text-sm text-gray-900">
                  {transaction.date}
                </td>

                {/* Amount */}
                <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                  - ${Math.abs(transaction.amount)}
                </td>

                {/* Payment Name with Icon */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {transaction.icon ? (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: transaction.iconBgColor || '#6366f1' }}
                      >
                        {transaction.icon}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-500">?</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-900">{transaction.paymentName}</span>
                  </div>
                </td>

                {/* Method */}
                <td className="py-4 px-4 text-sm text-gray-900">
                  {transaction.method}
                </td>

                {/* Category */}
                <td className="py-4 px-4 text-sm text-gray-600">
                  {transaction.category}
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