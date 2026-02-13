import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TableChartProps {
    className?: string
}

const data = [
    { month: 'Jan', income: 9500, expense: 8200 },
    { month: 'Feb', income: 10200, expense: 12500 },
    { month: 'Mar', income: 10000, expense: 9800 },
    { month: 'Apr', income: 13000, expense: 11500 },
    { month: 'May', income: 12500, expense: 11200 },
    { month: 'Jun', income: 7500, expense: 6200 },
    { month: 'Jul', income: 9000, expense: 7500 },
];

const TableChart = ({
    className
}: TableChartProps) => {
    return (
        <div className={`${className} bg-white rounded-3xl p-8 shadow-sm`}>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Money flow</h2>

                <div className="flex items-center gap-6">
                    {/* Legend */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6366f1]"></div>
                            <span className="text-xs text-gray-600">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#a5b4fc]"></div>
                            <span className="text-xs text-gray-600">Expense</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <select className="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white">
                        <option>All accounts</option>
                        <option>Checking</option>
                        <option>Savings</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white">
                        <option>This year</option>
                        <option>This month</option>
                        <option>Last 6 months</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barGap={4}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                        ticks={[0, 5000, 10000, 15000]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar
                        dataKey="income"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="expense"
                        fill="#a5b4fc"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TableChart;