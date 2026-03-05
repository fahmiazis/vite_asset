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
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        
        {showArrow && (
          <button
            onClick={onArrowClick}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {icon || <ArrowUpRight01Icon className="w-3 h-3 text-gray-700" />}
          </button>
        )}
      </div>

      {/* Balance */}
      <div className="mb-1">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            {showCurrency && 'Rp'} {whole}
          </span>
          <span className="text-2xl font-bold text-gray-300">
            {showCurrency && `.${decimal}`}
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
            <span className="text-sm">
              {trend.isPositive !== false ? '↑' : '↓'}
            </span>
            <span className="text-xs font-semibold">
              {Math.abs(trend.value)}%
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {trend.label || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;