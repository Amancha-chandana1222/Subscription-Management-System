import { useState, useEffect } from "react";
import { getMyRequests } from "../../api/index.js";
import { SectionCard } from "../../components/index.jsx";
import { StatusBadge } from "../../components/index.jsx";

const STATUS_META = {
  PENDING:  { dot: "#d97706", msg: "Awaiting admin review"    },
  APPROVED: { dot: "#16a34a", msg: "License assigned to you"  },
  REJECTED: { dot: "#dc2626", msg: "Request was not approved" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EmployeeMyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getMyRequests()
      .then(r=>setRequests(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
console.log(requests);
  const pending  = requests.filter(r => r.status === "PENDING").length;
  const approved = requests.filter(r => r.status === "APPROVED").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        {[
          { label: "PENDING",  value: pending,  dark: true },
          { label: "APPROVED", value: approved },
          { label: "REJECTED", value: rejected },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.dark ? "#0a0a0a" : "#ffffff",
            border: `1px solid ${s.dark ? "#1a1a1a" : "#ebebeb"}`,
            borderRadius: 12, padding: "18px 20px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: s.dark ? "#666" : "#a0a0a0" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, letterSpacing: "-1px", color: s.dark ? "#fff" : "#0a0a0a" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Request history" noPadding>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr 90px 100px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>Tool</span><span>Reason</span><span>Status</span><span>Date</span>
        </div>

        {loading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading your requests…
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            You haven't made any requests yet.
          </div>
        )}

        {requests.map((r) => {
          const meta = STATUS_META[r.status] || STATUS_META.pending;
          return (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "1fr 2fr 90px 100px",
              padding: "16px 20px", borderBottom: "1px solid #f9f9f9",
              alignItems: "center", fontSize: 13,
            }}>
              <span style={{ fontWeight: 600 }}>{r.toolName}</span>
              <div>
                <div style={{ color: "#525252" }}>{r.reason}</div>
                <div style={{ fontSize: 11, color: meta.dot, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                  {meta.msg}
                </div>
              </div>
              <StatusBadge status={r.status} />
              <span style={{ fontSize: 12, color: "#b0b0b0" }}>{formatDate(r.createdAt)}</span>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}
