import { ArrowUpRight01Icon } from "hugeicons-react";

interface BalanceCardProps {
  title: string;
  balance: number;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  showArrow?: boolean;
  onArrowClick?: () => void;
  className?: string;
}

const BalanceCard = ({
  title,
  balance,
  trend,
  icon,
  showArrow = true,
  onArrowClick,
  className = '',
}: BalanceCardProps) => {
  // Format balance dengan separator
  const formatBalance = (value: number) => {
    const formatted = value.toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return { whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, ','), decimal };
  };

  const { whole, decimal } = formatBalance(balance);

  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {showArrow && (
          <button
            onClick={onArrowClick}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {icon || <ArrowUpRight01Icon className="w-5 h-5 text-gray-700" />}
          </button>
        )}
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-gray-900">
            ${whole}
          </span>
          <span className="text-5xl font-bold text-gray-300">
            .{decimal}
          </span>
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              trend.isPositive !== false
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <span className="text-lg">
              {trend.isPositive !== false ? '↑' : '↓'}
            </span>
            <span className="text-sm font-semibold">
              {Math.abs(trend.value)}%
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {trend.label || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;