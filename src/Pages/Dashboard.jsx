import { useState, useEffect } from "react";
import { getDashboardStats, getTools } from "../api/index.js";
import { StatCard, SectionCard, ToolDot, ProgressBar, Btn } from "../components/index.jsx";
import { StatusBadge } from "../components/index.jsx";

const MONTHS = ["May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
const BAR_HEIGHTS = [40, 55, 48, 72, 60, 85, 68, 90, 78, 95, 82, 100];
const ALERT_COLORS = { danger: "#dc2626", warning: "#d97706", info: "#2563eb" };

export default function Dashboard({ setActive }) {
  const [stats, setStats]   = useState(null);
  const [tools, setTools]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getTools()])
      .then(([s, t]) => { 
        console.log(s);
        console.log(t);
        setStats(s);
         setTools(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  console.log(tools);
  const alerts = [
    ...(tools.filter(t => t.status === "warning").map(t => ({ text: `${t.name} renewal soon — check capacity`, type: "danger" }))),
    { text: `${stats.pendingRequests} pending access requests`, type: "info" },
  ];
const max = Math.max(...BAR_HEIGHTS);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Monthly spend"  value={`$${(stats.totalMonthlySpend).toLocaleString()}`} sub={`across ${stats.totalTools} tools`} dark />
        <StatCard label="Total licenses" value={stats.totalLicenses}       sub={`across ${stats.totalTools} tools`} />
        <StatCard label="Utilization"    value={`${stats.utilization}%`}   progress={stats.utilization} />
        <StatCard label="Wasted spend"   value={`$${stats.wastedSpend.toLocaleString()}`} sub="unused licenses" danger />
      </div>

      {/* Chart + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(0,1fr)", gap: 14 }}>
        <SectionCard title="Spend over 12 months">
          <div style={{ fontSize: 11, color: "#b0b0b0", marginBottom: 16 }}>Apr 2025 – Apr 2026</div>
  <div
  style={{
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    height: "120px",
    width: "100%",
  }}
>
  {BAR_HEIGHTS.map((h, i) => (
    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
      <div style={{
        marginTop: "auto",          // ← pushes bar to bottom
        background: i ===11 ? "#000" : "#9ca3af",
        borderRadius: "3px 3px 0 0",
        height: `${(h / max) * 100}%`,
        width: "100%",
        minHeight: 2,
      }} />
      <span style={{ fontSize: 9, color: "#c0c0c0", fontWeight: 500 }}>{MONTHS[i]}</span>
    </div>
  ))}
</div>
        </SectionCard>

        <SectionCard title="Alerts">
          {alerts.length === 0
            ? <p style={{ fontSize: 12, color: "#b0b0b0" }}>No alerts</p>
            : alerts.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "9px 0", borderBottom: i < alerts.length - 1 ? "1px solid #f5f5f5" : "none",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                  background: ALERT_COLORS[a.type],
                }} />
                <span style={{ fontSize: 12, color: "#525252", lineHeight: 1.5 }}>{a.text}</span>
              </div>
            ))
          }
        </SectionCard>
      </div>
          
      {/* Top tools table */}
      <SectionCard
        title="Top tools by spend"
        noPadding
        action={<Btn variant="ghost" small onClick={() => setActive("tools")}>View all</Btn>}
      >
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>Tool</span><span>Licenses</span><span>Utilization</span><span>Monthly</span><span>Status</span>
        </div>

        {[...tools].sort((a, b) => b.costMonthly - a.costMonthly).slice(0, 5).map((t) => (
          <div key={t.id} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
            padding: "13px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ToolDot abbr={t.abbr} size={30} />
              <span style={{ fontWeight: 500 }}>{t.name}</span>
            </div>
            <span style={{ color: "#525252" }}>{t.assignedSeats}/{t.totalSeats}</span>
            <ProgressBar value={t.assignedSeats} max={t.totalSeats} />
            <span style={{ fontWeight: 600 }}>${t.costMonthly}</span>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#a0a0a0", fontSize: 13 }}>
      Loading dashboard…
    </div>
  );
}
