// AlertsPanel.tsx
import React from 'react';

const AlertsPanel= () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '5 unused licenses detected in Slack workspace',
      time: '2 hours ago',
      action: 'Review →'
    },
    {
      id: 2,
      type: 'danger',
      message: 'Zoom Pro subscription expires in 2 days',
      time: 'Yesterday',
      action: 'Renew now →'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Figma seats utilization dropped to 62%',
      time: '3 days ago',
      action: 'Optimize →'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
        <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">3 active</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border ${
              alert.type === 'danger'
                ? 'border-red-200 bg-red-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex gap-3">
              <div className={`text-xl mt-0.5 ${alert.type === 'danger' ? 'text-red-500' : 'text-amber-500'}`}>
                {alert.type === 'danger' ? '⚠️' : '⚡'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 leading-relaxed">{alert.message}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{alert.time}</span>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    {alert.action}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-2xl transition-colors">
        View all alerts
      </button>
    </div>
  );
};

export default AlertsPanel;