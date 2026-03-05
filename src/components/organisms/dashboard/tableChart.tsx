import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TableChartProps {
    className?: string
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

const TableChart = ({
    className
}: TableChartProps) => {
    return (
        <div className={`${className} bg-white rounded-3xl p-8 shadow-sm`}>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Transaction flow</h2>

                <div className="flex items-center gap-6">
                    {/* Legend */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                            <span className="text-xs text-gray-600">Finished</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                            <span className="text-xs text-gray-600">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                            <span className="text-xs text-gray-600">Rejected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                            <span className="text-xs text-gray-600">Revisi</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <select className="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white">
                        <option>All Transaction</option>
                        <option>Procurement</option>
                        <option>Disposal</option>
                        <option>Mutation</option>
                        <option>Stock Opname</option>
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
                        tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                        ticks={[0, 25, 50, 75, 100, 125, 150]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                        formatter={(value) => `${Number(value).toLocaleString()}`}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar
                        dataKey="finished"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="in_progress"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="rejected"
                        fill="#ef4444"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="revisi"
                        fill="#f59e0b"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TableChart;