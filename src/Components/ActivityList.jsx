// ActivityList.tsx
import React from 'react';

const ActivityList= () => {
  const activities = [
    {
      id: 1,
      action: "Sahith assigned Slack Enterprise to",
      target: "John Doe",
      time: "11m ago",
      icon: "👤"
    },
    {
      id: 2,
      action: "Figma Professional plan renewed for",
      target: "Design team",
      time: "2h ago",
      icon: "🎨"
    },
    {
      id: 3,
      action: "Notion subscription upgraded to Plus",
      target: "",
      time: "Yesterday",
      icon: "📝"
    },
    {
      id: 4,
      action: "Zoom license removed from",
      target: "Marketing team",
      time: "2 days ago",
      icon: "📹"
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</button>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700">
                {activity.action}{' '}
                {activity.target && <span className="font-medium text-gray-900">{activity.target}</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;