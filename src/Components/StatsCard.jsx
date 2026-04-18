
const StatsCard= ({ title, value, trend, trendUp, icon }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-gray-100 rounded-2xl">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? (
            <span>↑</span>
          ) : (
            <span>↓</span>
          )}
          <span>{trend}</span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500 font-medium tracking-wide">{title}</p>
        <p className="text-4xl font-semibold text-gray-900 mt-2 tracking-tighter">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;