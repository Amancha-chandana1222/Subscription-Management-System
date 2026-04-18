// ChartCard.tsx
import React from 'react';

const ChartCard = () => {
  // Mock data for monthly spend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const spend = [3200, 3450, 2980, 4120, 3870, 4250, 3980, 4520, 4310, 4780, 4620, 4872];

  const maxSpend = Math.max(...spend);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Monthly Spend Trend</h2>
          <p className="text-sm text-gray-500 mt-1">Last 12 months • Total: $48,872</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="px-4 py-1.5 bg-gray-100 rounded-2xl text-gray-700 font-medium">2026</div>
          <div className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-2xl cursor-pointer transition-colors">2025</div>
        </div>
      </div>

      {/* Simple SVG Bar Chart */}
      <div className="h-80 flex items-end gap-3 pt-8">
        {spend.map((value, index) => {
          const height = (value / maxSpend) * 100;
          const isCurrent = index === spend.length - 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex justify-center">
                <div
                  className={`w-full max-w-[38px] rounded-t-xl transition-all duration-300 ${
                    isCurrent ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'
                  }`}
                  style={{ height: `${height}%` }}
                />
                {isCurrent && (
                  <div className="absolute -top-7 text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded-xl shadow-sm border border-gray-100">
                    ${value}
                  </div>
                )}
              </div>
              <div className="text-[10px] text-gray-400 font-medium mt-1">{months[index]}</div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-4 px-1">
        <div>Jan 2025</div>
        <div>Dec 2025</div>
      </div>
    </div>
  );
};

export default ChartCard;