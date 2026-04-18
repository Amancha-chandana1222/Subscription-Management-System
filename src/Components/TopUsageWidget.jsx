// TopUsageWidget.tsx
import React from 'react';

const TopUsageWidget = () => {
  const tools = [
    { name: "Slack", usage: "98%", seats: "42/43", color: "bg-indigo-500" },
    { name: "Figma", usage: "87%", seats: "31/36", color: "bg-pink-500" },
    { name: "Notion", usage: "76%", seats: "28/37", color: "bg-emerald-500" },
    { name: "Zoom", usage: "64%", seats: "19/30", color: "bg-blue-500" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Software Usage</h2>

      <div className="space-y-7">
        {tools.map((tool, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-gray-900">{tool.name}</div>
              <div className="text-sm font-mono text-gray-500">{tool.usage}</div>
            </div>
            
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${tool.color} rounded-full transition-all`}
                style={{ width: tool.usage }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>{tool.seats} seats</span>
              <span>Utilization</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Average utilization</div>
        <div className="text-4xl font-semibold text-gray-900 tracking-tighter">81.2%</div>
      </div>
    </div>
  );
};

export default TopUsageWidget;