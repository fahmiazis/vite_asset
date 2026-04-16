import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TableChartProps {
  className?: string;
}

const data = [
  { month: 'Jan', finished: 95, in_progress: 82, rejected: 40, revisi: 25 },
  { month: 'Feb', finished: 102, in_progress: 125, rejected: 45, revisi: 25 },
  { month: 'Mar', finished: 87, in_progress: 98, rejected: 55, revisi: 25 },
  { month: 'Apr', finished: 130, in_progress: 115, rejected: 30, revisi: 25 },
  { month: 'May', finished: 125, in_progress: 112, rejected: 25, revisi: 25 },
  { month: 'Jun', finished: 75, in_progress: 62, rejected: 37, revisi: 25 },
  { month: 'Jul', finished: 90, in_progress: 75, rejected: 59, revisi: 25 },
];

const LEGEND = [
  { key: 'finished',   label: 'Finished',    color: '#10b981' },
  { key: 'in_progress',label: 'In Progress', color: '#3b82f6' },
  { key: 'rejected',   label: 'Rejected',    color: '#ef4444' },
  { key: 'revisi',     label: 'Revisi',      color: '#f59e0b' },
];

// Custom tooltip biar dark mode konsisten
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-xs shadow-lg">
      <p className="text-zinc-400 font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          <span className="text-zinc-400 min-w-[72px]">{p.name}</span>
          <span className="text-zinc-100 font-semibold ml-auto pl-3">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TableChart = ({ className }: TableChartProps) => {
  return (
    <div className={`
      ${className}
      bg-white dark:bg-gray-800
      border border-gray-100 dark:border-zinc-800
      rounded-3xl p-8
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">
          Transaction flow
        </h2>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-4">
            {LEGEND.map((l) => (
              <div key={l.key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-xs text-gray-500 dark:text-zinc-500">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <select className="
            px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-600 dark:text-zinc-400
            focus:border-gray-400 dark:focus:border-zinc-500
          ">
            <option>All Transaction</option>
            <option>Procurement</option>
            <option>Disposal</option>
            <option>Mutation</option>
            <option>Stock Opname</option>
          </select>

          <select className="
            px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-600 dark:text-zinc-400
            focus:border-gray-400 dark:focus:border-zinc-500
          ">
            <option>This year</option>
            <option>This month</option>
            <option>Last 6 months</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barGap={3}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            // pakai CSS variable tidak bisa di recharts, jadi detect manual
            stroke="rgba(113,113,122,0.2)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(v) => `${Number(v).toLocaleString()}`}
            ticks={[0, 25, 50, 75, 100, 125, 150]}
            width={36}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          {LEGEND.map((l) => (
            <Bar
              key={l.key}
              dataKey={l.key}
              name={l.label}
              fill={l.color}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TableChart;