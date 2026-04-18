import { useState, useEffect } from "react";
import { getTools, getLicenses, revokeLicense } from "../api/index.js";
import { StatCard, SectionCard, Btn } from "../components/index.jsx";

export default function UsagePage() {
  const [tools,    setTools]    = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getTools(), getLicenses()])
      .then(([t, l]) => { setTools(t.data); setLicenses(l.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
console.log("tools:", tools);
console.log("licenses:", licenses);
  const totalLic = tools.reduce((a, t) => a + t.totalSeats, 0);
  const assigned = tools.reduce((a, t) => a + t.assignedSeats, 0);
  const util     = totalLic ? Math.round((assigned / totalLic) * 100) : 0;

  // Inactive: licenses with status inactive
  const inactive = licenses.filter(l => l.status === "INACTIVE");
  const active   = licenses.filter(l => l.status === "ACTIVE").length;

  const handleRevoke = async (id) => {
    try {
      await revokeLicense(id);
      setLicenses(prev => prev.filter(l => l.id !== id));
    } catch (e) {
      alert("Revoke failed: " + e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Active licenses"  value={active}       sub="currently in use" />
        <StatCard label="Inactive licenses" value={inactive.length} sub="no recent activity" danger />
        <StatCard label="Avg utilization"  value={`${util}%`}   sub="across all tools" />
      </div>

      <SectionCard title="License utilization by tool" noPadding>
        <div style={{ padding: "0 20px" }}>
          {loading ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>Loading…</div>
          ) : tools.map((t) => {
            const pct   = t.totalSeats ? Math.round((t.assignedSeats / t.totalSeats) * 100) : 0;
            const color = pct < 50 ? "#dc2626" : pct < 75 ? "#d97706" : "#0a0a0a";
            return (
              <div key={t.id} style={{
                display: "grid", gridTemplateColumns: "140px 1fr 60px 100px",
                alignItems: "center", gap: 16, padding: "12px 0",
                borderBottom: "1px solid #f5f5f5",
              }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                <div style={{ background: "#f0f0f0", borderRadius: 99, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.4s" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#525252" }}>{pct}%</span>
                <span style={{ fontSize: 12, color: "#a0a0a0" }}>{t.assignedSeats}/{t.totalSeats} seats</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Revocation candidates"
        action={<span style={{ fontSize: 12, color: "#a0a0a0" }}>Inactive licenses</span>}
        noPadding
      >
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>User</span><span>Tool</span><span>Last active</span><span>Status</span><span></span>
        </div>

        {inactive.length === 0 && !loading && (
          <div style={{ padding: "24px 20px", fontSize: 13, color: "#a0a0a0" }}>
            No inactive licenses.
          </div>
        )}

        {inactive.map((l) => (
          <div key={l.id} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px",
            padding: "13px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
          }}>
            <span style={{ fontWeight: 500 }}>{l.user?.name}</span>
            <span style={{ color: "#525252" }}>{l.tool?.name}</span>
            <span style={{ color: "#a0a0a0" }}>{l.lastActive}</span>
            <span style={{ color: "#dc2626", fontWeight: 600, textTransform: "capitalize" }}>{l.status}</span>
            <Btn variant="primary" small onClick={() => handleRevoke(l.id)}>Revoke</Btn>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
