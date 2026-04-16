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
  showCurrency: boolean;
}

const BalanceCard = ({
  title,
  balance,
  trend,
  icon,
  showArrow = true,
  onArrowClick,
  className = '',
  showCurrency = true
}: BalanceCardProps) => {
  const formatBalance = (value: number) => {
    const formatted = value.toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return {
      whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
      decimal,
    };
  };

  const { whole, decimal } = formatBalance(balance);

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
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          {title}
        </h3>

        {showArrow && (
          <button
            onClick={onArrowClick}
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              border border-gray-200 dark:border-gray-700
              text-gray-500 dark:text-zinc-400
              hover:bg-gray-50 dark:hover:bg-zinc-800
              transition-colors flex-shrink-0
            "
          >
            {icon || <ArrowUpRight01Icon className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Balance */}
      <div className="flex items-baseline my-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
          {showCurrency ? `Rp ${whole}` : whole}
        </span>
        {showCurrency && (
          <span className="text-2xl font-bold text-gray-200 dark:text-zinc-700">
            .{decimal}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
              ${trend.isPositive !== false
                ? 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
              }
            `}
          >
            <span>{trend.isPositive !== false ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            {trend.label || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;