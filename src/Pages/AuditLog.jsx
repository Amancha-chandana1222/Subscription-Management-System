import { useState, useEffect } from "react";
import { getAuditLogs, getAuditLogsForExport } from "../api/index.js";
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
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditLogs()
      .then((res) => {
        const payload = res?.data;
        const records = Array.isArray(payload) ? payload : payload?.logs;
        if (!Array.isArray(records)) {
          throw new Error("The audit log response was not in the expected format.");
        }
        setLogs(records);
      })
      .catch((err) => setError(err.message || "Unable to load audit logs."))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = async () => {
    setExporting(true);
    setMessage("");
    setError("");
    try {
    const response = await getAuditLogsForExport();
    if (!(response?.data instanceof Blob) || response.data.size === 0) {
      throw new Error("The audit export returned an empty or invalid CSV file.");
    }
    const blob = response.data;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const disposition = response.headers.get("content-disposition") ?? "";
    const filename = disposition.match(/filename="?([^"]+)"?/)?.[1]
      ?? `LicenseIQ_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.href = url;
    anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Audit log CSV downloaded successfully.");
    } catch (err) {
      setError(err.message || "Unable to export audit logs.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <SectionCard
      title="Activity log"
      noPadding
      action={
        <Btn variant="ghost" small onClick={exportCsv} disabled={exporting}>
          <Icons.download /> {exporting ? "Exporting…" : "Export CSV"}
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

      {message && <div style={{ padding: "10px 20px", color: "#166534", background: "#f0fdf4", fontSize: 13 }}>{message}</div>}
      {error && <div style={{ padding: "10px 20px", color: "#b91c1c", background: "#fef2f2", fontSize: 13 }}>{error}</div>}

      {loading && (
        <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
          Loading audit log…
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div style={{ padding: "32px 20px", textAlign: "center", color: "#888", fontSize: 13 }}>
          No audit log records found.
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
            <span style={{ color: "#525252" }}>{a.actorName ?? "System"}</span>
            <span style={{ color: "#a0a0a0", fontSize: 12 }}>{a.resource}</span>
            <span style={{ color: "#b0b0b0", fontSize: 12 }}>{formatTime(a.createdAt)}</span>
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
