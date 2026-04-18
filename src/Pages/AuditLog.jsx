import { useState, useEffect } from "react";
import { getAuditLogs } from "../api/index.js";
import { SectionCard, Btn } from "../components/index.jsx";
import { Icons } from "../components/Icons.jsx";

const TYPE_STYLE = {
  danger:  { bg: "#fef2f2", color: "#dc2626", label: "Revoke"  },
  success: { bg: "#f0fdf4", color: "#16a34a", label: "Success" },
  warning: { bg: "#fffbeb", color: "#d97706", label: "Auto"    },
  info:    { bg: "#eff6ff", color: "#2563eb", label: "Info"    },
};

function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function AuditPage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((res)=>setLogs(res.data.logs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
console.log(logs)
  return (
    <SectionCard
      title="Activity log"
      noPadding
      action={
        <Btn variant="ghost" small>
          <Icons.download /> Export CSV
        </Btn>
      }
    >
      <div style={{
        display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 110px 80px",
        fontSize: 11, fontWeight: 600, color: "#a0a0a0",
        letterSpacing: "0.05em", textTransform: "uppercase",
        padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
      }}>
        <span>Action</span><span>Actor</span><span>Resource</span><span>Time</span><span>Type</span>
      </div>

      {loading && (
        <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
          Loading audit log…
        </div>
      )}

      {logs.map((a) => {
        const s = TYPE_STYLE[a.type] || TYPE_STYLE.info;
        return (
          <div key={a.id} style={{
            display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 110px 80px",
            padding: "13px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
          }}>
            <span style={{ fontWeight: 600 }}>{a.action}</span>
            <span style={{ color: "#525252" }}>{a.actor}</span>
            <span style={{ color: "#a0a0a0", fontSize: 12 }}>{a.resource}</span>
            <span style={{ color: "#b0b0b0", fontSize: 12 }}>{formatTime(a.timestamp)}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
              display: "inline-block", background: s.bg, color: s.color,
            }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </SectionCard>
  );
}
