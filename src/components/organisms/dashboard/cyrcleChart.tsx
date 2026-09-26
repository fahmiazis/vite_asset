import { ArrowUpRight01Icon } from 'hugeicons-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface BudgetCategory {
  name: string;
  value: number;
  color: string;
}

interface BudgetChartProps {
  categories: BudgetCategory[];
  total: number;
  highlightedCategory?: {
    name: string;
    percentage: number;
    amount: number;
  };
  showArrow?: boolean;
  onArrowClick?: () => void;
  className?: string;
  title?: string;
  /** teks kecil di tengah donut */
  centerLabel?: string;
}

const BudgetChart = ({
  categories,
  total,
  highlightedCategory,
  showArrow = true,
  onArrowClick,
  className = '',
  title = 'Total Transaction',
  centerLabel = 'Total for month',
}: BudgetChartProps) => {
  const formatCurrency = (value: number) => {
    const formatted = value.toFixed(2);
    const [whole, decimal] = formatted.split('.');
    return { whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, ','), decimal };
  };

  const { whole, decimal } = formatCurrency(total);

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
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{title}</h3>

        {showArrow && (
          <button
            onClick={onArrowClick}
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              border border-gray-100 dark:border-zinc-800
              text-gray-500 dark:text-zinc-400
              hover:bg-gray-50 dark:hover:bg-zinc-900
              transition-colors flex-shrink-0
            "
          >
            <ArrowUpRight01Icon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Legend — 2 kolom supaya donut bisa naik */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs text-gray-700 dark:text-zinc-400 truncate">{category.name}</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50 ml-auto pl-2">{category.value}</span>
          </div>
        ))}
      </div>

      {/* Donut Chart — di tengah, lebar mengikuti kartu */}
      <div className="flex justify-center mt-4">
        <div className="relative w-full max-w-[340px] aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={total > 0 ? categories : [{ name: '-', value: 1, color: '#e5e7eb' }]}
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="96%"
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {(total > 0 ? categories : [{ name: '-', value: 1, color: '#e5e7eb' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-sm text-gray-400 dark:text-zinc-500 mb-1">{centerLabel}</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900 dark:text-zinc-50">{whole}</span>
            </div>
          </div>

          {/* Tooltip for highlighted category */}
          {highlightedCategory && (
            <div className="
              absolute top-0 right-0
              bg-white dark:bg-zinc-900
              border border-gray-100 dark:border-zinc-800
              rounded-xl shadow-lg px-3 py-2
              whitespace-nowrap
            ">
              <div className="text-xs text-gray-500 dark:text-zinc-400">{highlightedCategory.percentage}%</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-zinc-50">
                ${highlightedCategory.amount}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;