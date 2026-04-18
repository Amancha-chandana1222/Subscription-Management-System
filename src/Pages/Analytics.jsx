import { useState, useEffect } from "react";
import { getTools } from "../api/index.js";
import { StatCard, SectionCard, ToolDot } from "../components/index.jsx";

export default function Analytics() {
  const [tools,   setTools]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTools()
      .then((t)=>setTools(t.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
console.log("tools:", tools);
  const toolData = tools.map((t) => ({
    ...t,
    wasted: Math.round(t.costMonthly * (1 - t.assignedSeats / t.totalSeats)),
  })).sort((a, b) => b.costMonthly - a.costMonthly);

  const total  = toolData.reduce((a, t) => a + t.costMonthly, 0);
  const wasted = toolData.reduce((a, t) => a + t.wasted, 0);

  const tips = [
    { tool: "Zoom",   abbr: "ZM", action: "Downgrade plan — 50% seats unused", saving: "$240/mo" },
    { tool: "Linear", abbr: "LN", action: "Remove 18 inactive users",           saving: "$216/mo" },
    { tool: "Notion", abbr: "NO", action: "Reduce seats by 29",                 saving: "$232/mo" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#a0a0a0", fontSize: 13 }}>
      Loading analytics…
    </div>
  );
console.log("total:", total, "wasted:", wasted);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Annual spend"   value={`$${(total * 12).toLocaleString()}`} sub="projected" />
        <StatCard label="Monthly spend"  value={`$${total.toLocaleString()}`}         sub="this month" dark />
        <StatCard label="Recoverable"    value={`$${wasted.toLocaleString()}`}        sub="unused licenses" danger />
      </div>

      <SectionCard title="Cost breakdown by tool" noPadding>
        <div style={{ padding: "0 20px" }}>
          {toolData.map((t) => (
            <div key={t.id} style={{
              display: "grid", gridTemplateColumns: "130px 1fr 110px 120px",
              alignItems: "center", gap: 16, padding: "13px 0",
              borderBottom: "1px solid #f5f5f5",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ToolDot abbr={t.abbr} size={26} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
              </div>

              <div style={{ display: "flex", height: 8, gap: 2 }}>
                <div style={{
                  background: "#0a0a0a", borderRadius: "3px 0 0 3px",
                  width: `${Math.round((t.costMonthly / total) * 100)}%`, minWidth: 4,
                }} />
                <div style={{ background: "#f0f0f0", borderRadius: "0 3px 3px 0", flex: 1 }} />
              </div>

              <span style={{ fontSize: 12, color: "#525252", textAlign: "right" }}>
                ${t.costMonthly.toLocaleString()}/mo
              </span>
              <span style={{ fontSize: 12, color: "#dc2626", textAlign: "right", fontWeight: 500 }}>
                −${t.wasted.toLocaleString()} wasted
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Optimization panel */}
      <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 24, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Optimization opportunities</div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
          Based on current usage data — potential savings highlighted
        </div>
        {tips.map((o) => (
          <div key={o.tool} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "13px 0", borderBottom: "1px solid #1a1a1a",
          }}>
            <div style={{
              width: 28, height: 28, background: "#1a1a1a", borderRadius: 7,
              color: "#fff", fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {o.abbr}
            </div>
            <span style={{ flex: 1, fontSize: 13, color: "#d0d0d0" }}>{o.action}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4ade80" }}>{o.saving}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, fontSize: 12, color: "#444" }}>
          Total recoverable: <span style={{ color: "#4ade80", fontWeight: 700 }}>
            ${tips.reduce((a, t) => a + parseInt(t.saving.replace(/\D/g, "")), 0)}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
