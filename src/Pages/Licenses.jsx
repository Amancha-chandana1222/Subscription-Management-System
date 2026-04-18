import { useState, useEffect } from "react";
import { getLicenses, revokeLicense, assignLicense, getUsers, getTools } from "../api/index.js";
import { StatCard, SectionCard, Btn } from "../components/index.jsx";
import { StatusBadge } from "../components/index.jsx";

function AssignModal({ onClose, onSuccess }) {
  const [users,   setUsers]   = useState([]);
  const [tools,   setTools]   = useState([]);
  const [userId,  setUserId]  = useState("");
  const [toolId,  setToolId]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([getUsers(), getTools()])
      .then(([u, t]) => {
        setUsers(u.data);
        setTools(t.data);
      })
      .catch(() => setError("Failed to load users/tools"));
  }, []);

  const handleSubmit = async () => {
    if (!userId || !toolId) return setError("Please select both a user and a tool.");
    setLoading(true);
    setError(null);
    try {
      await assignLicense(userId, toolId);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message ?? "Failed to assign license.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 28,
        width: 400, display: "flex", flexDirection: "column", gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Assign License</h3>

        <label style={labelStyle}>
          User
          <select value={userId} onChange={e => setUserId(e.target.value)} style={selectStyle}>
            <option value="">— select user —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
        </label>

        <label style={labelStyle}>
          Tool
          <select value={toolId} onChange={e => setToolId(e.target.value)} style={selectStyle}>
            <option value="">— select tool —</option>
            {tools.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>

        {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Btn variant="ghost" small onClick={onClose} disabled={loading}>Cancel</Btn>
          <Btn variant="primary" small onClick={handleSubmit} disabled={loading}>
            {loading ? "Assigning…" : "Assign"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500, color: "#374151" };
const selectStyle = { padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none" };

export default function LicensesPage() {
  const [licenses,     setLicenses]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showAssign,   setShowAssign]   = useState(false);   // ← controls modal

  const load = () => {
    setLoading(true);
    getLicenses()
      .then((l) => setLicenses(l.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRevoke = async (id) => {
    try {
      await revokeLicense(id);
      load();
    } catch (e) {
      alert("Failed to revoke: " + e.message);
    }
  };

  const total     = licenses.length;
  const assigned  = licenses.filter(l => l.status === "ACTIVE").length;
  const available = total - assigned;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {showAssign && (
        <AssignModal
          onClose={() => setShowAssign(false)}
          onSuccess={load}                        // refreshes list after assign
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Total licenses" value={total}     sub="across all tools" />
        <StatCard label="Assigned"       value={assigned}  sub="to active users" dark />
        <StatCard label="Available"      value={available} sub="unassigned seats" />
      </div>

      <SectionCard
        title="All licenses"
        noPadding
        action={
          <Btn variant="primary" small onClick={() => setShowAssign(true)}>  {/* ← fixed */}
            Assign license
          </Btn>
        }
      >
        <div style={{
          display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 80px 80px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>User</span><span>Tool</span><span>Assigned</span><span>Last active</span><span>Status</span><span></span>
        </div>

        {loading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading licenses…
          </div>
        )}

        {!loading && licenses.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            No licenses found.
          </div>
        )}

        {licenses.map((l) => {
          const stale = l.lastActiveAt && l.lastActiveAt.includes("d ago") && parseInt(l.lastActiveAt) > 20;
          return (
            <div key={l.id} style={{
              display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 80px 80px",
              padding: "13px 20px", borderBottom: "1px solid #f9f9f9",
              alignItems: "center", fontSize: 13,
            }}>
              <span style={{ fontWeight: 500 }}>{l.userName}</span>
              <span style={{ color: "#525252" }}>{l.toolName}</span>
              <span style={{ color: "#a0a0a0" }}>{l.assignedAt}</span>
              <span style={{ color: stale ? "#dc2626" : "#525252", fontWeight: stale ? 600 : 400 }}>
                {l.lastActiveAt}
              </span>
              <StatusBadge status={l.status} />
              <Btn variant="danger" small onClick={() => handleRevoke(l.id)}>Revoke</Btn>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}