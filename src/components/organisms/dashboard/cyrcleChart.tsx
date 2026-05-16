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
}

const BudgetChart = ({
  categories,
  total,
  highlightedCategory,
  showArrow = true,
  onArrowClick,
  className = '',
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
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Total Transaction</h3>

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

      <div className="flex items-center justify-between gap-12">
        {/* Legend */}
        <div className="flex flex-col gap-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-700 dark:text-zinc-400">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={280} height={280}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Total for month</div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-gray-900 dark:text-zinc-50">{whole}</span>
            </div>
          </div>

          {/* Tooltip for highlighted category */}
          {highlightedCategory && (
            <div className="
              absolute -top-3 -right-1
              bg-white dark:bg-zinc-900
              border border-gray-100 dark:border-zinc-800
              rounded-xl shadow-lg px-3 py-2
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