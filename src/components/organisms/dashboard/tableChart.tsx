import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardFlowRow } from '../../../models/dashboard';
import { TRANSACTION_TYPES } from '../../../utils/transactionType';

interface TableChartProps {
  className?: string;
  /** 6 bulan terakhir per jenis transaksi; kosong = grafik nol */
  flow?: DashboardFlowRow[];
}

const LEGEND = [
  { key: 'finished',    color: '#10b981' },
  { key: 'in_progress', color: '#3b82f6' },
  { key: 'rejected',    color: '#ef4444' },
  { key: 'cancelled',   color: '#9ca3af' },
] as const;

/** YYYY-MM → "Sep" sesuai bahasa aktif */
function monthLabel(month: string, locale: string) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: 'short' });
}

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

const TableChart = ({ className, flow = [] }: TableChartProps) => {
  const { t, i18n } = useTranslation();
  const [type, setType] = useState('');

  // jumlahkan per bulan untuk jenis yang dipilih (kosong = semua jenis)
  const byMonth = new Map<string, { month: string; finished: number; in_progress: number; rejected: number; cancelled: number }>();
  for (const row of flow) {
    const entry = byMonth.get(row.month) ?? { month: row.month, finished: 0, in_progress: 0, rejected: 0, cancelled: 0 };
    if (!type || row.transaction_type === type) {
      entry.finished += row.finished;
      entry.in_progress += row.in_progress;
      entry.rejected += row.rejected;
      entry.cancelled += row.cancelled;
    }
    byMonth.set(row.month, entry);
  }
  const data = [...byMonth.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({ ...d, month: monthLabel(d.month, i18n.language) }));

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
          {t('dashboardPage.flow.title')}
        </h2>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-4">
            {LEGEND.map((l) => (
              <div key={l.key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-xs text-gray-500 dark:text-zinc-500">{t(`dashboardPage.flow.${l.key}`)}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
            px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-600 dark:text-zinc-400
            focus:border-gray-400 dark:focus:border-zinc-500
          ">
            <option value="">{t('dashboardPage.allTransactions')}</option>
            {Object.entries(TRANSACTION_TYPES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>

          <span className="text-xs text-gray-500 dark:text-zinc-500">
            {t('dashboardPage.flow.lastSixMonths')}
          </span>
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
            allowDecimals={false}
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
              name={t(`dashboardPage.flow.${l.key}`)}
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