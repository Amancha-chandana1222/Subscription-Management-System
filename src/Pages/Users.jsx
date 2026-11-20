import { useState, useEffect } from "react";
import { getUsers, inviteUser, resendInvitation } from "../api/index.js";
import { SectionCard, Avatar, Btn } from "../Components/index.jsx";
import { StatusBadge } from "../Components/index.jsx";
import { Icons } from "../Components/Icons.jsx";

// ── Invite User Modal ─────────────────────────────────────────────────────────

function InviteUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "", email: "", role: "", department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role)
      return setError("Name, email and role are required.");

    setLoading(true);
    setError(null);
    try {
      await inviteUser({
        name:       form.name,
        email:      form.email,
        role:       form.role,
        department: form.department || null,
      });
      onSuccess();
      onClose();

      console.log("User invited:", form.email);
    } catch (e) {
      setError(e.message || "Failed to invite user.");
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
        background: "#fff", borderRadius: 12, padding: 28, width: 420,
        display: "flex", flexDirection: "column", gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Create User</h3>

        <Field label="Full name">
          <input style={inputStyle} placeholder="e.g. Jane Smith"
            value={form.name} onChange={set("name")} />
        </Field>

        <Field label="Email">
          <input style={inputStyle} type="email" placeholder="e.g. jane@company.com"
            value={form.email} onChange={set("email")} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Role">
            <select style={inputStyle} value={form.role} onChange={set("role")}>
              <option value="">— select role —</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </Field>
          <Field label="Department (optional)">
            <input style={inputStyle} placeholder="e.g. Engineering"
              value={form.department} onChange={set("department")} />
          </Field>
        </div>

        {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Btn variant="ghost" small onClick={onClose} disabled={loading}>Cancel</Btn>
          <Btn variant="primary" small onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating…" : "Create user"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{
      display: "flex", flexDirection: "column", gap: 6,
      fontSize: 13, fontWeight: 500, color: "#374151",
    }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb",
  fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users,      setUsers]      = useState([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [actionError, setActionError] = useState("");
  const [resendingId, setResendingId] = useState(null);

  const load = () => {
    setLoading(true);
    getUsers()
      .then((u) => setUsers(u.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resend = async (id) => {
    setActionError(""); setResendingId(id);
    try { await resendInvitation(id); } catch (e) { setActionError(e.message || "Unable to resend invitation."); }
    finally { setResendingId(null); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {showInvite && (
        <InviteUserModal
          onClose={() => setShowInvite(false)}
          onSuccess={load}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            style={{
              background: "#ffffff", border: "1px solid #ebebeb", borderRadius: 7,
              padding: "8px 12px 8px 34px", fontSize: 13, color: "#0a0a0a",
              outline: "none", width: 240,
            }}
          />
          <span style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", opacity: 0.3, display: "flex",
          }}>
            <Icons.search />
          </span>
        </div>
        <Btn variant="primary" onClick={() => setShowInvite(true)}>
          <Icons.plus /> Create user
        </Btn>
      </div>

      <SectionCard noPadding>
        {actionError && <p style={{ margin: "12px 20px", color: "#dc2626", fontSize: 13 }}>{actionError}</p>}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 110px 80px 150px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>User</span><span>Role</span><span>Department</span><span>Last active</span><span>Status</span><span>Actions</span>
        </div>

        {loading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading users…
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            {search ? `No users match "${search}"` : "No users found."}
          </div>
        )}

        {filtered.map((u) => (
          <div key={u.id} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 110px 80px 150px",
            padding: "14px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
            cursor: "pointer", transition: "background 0.1s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={u.name} size={32} />
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "#b0b0b0" }}>{u.email}</div>
              </div>
            </div>
            <span style={{ color: "#525252", textTransform: "capitalize" }}>
              {u.role?.toLowerCase()}
            </span>
            <span style={{ color: "#525252" }}>{u.department ?? "—"}</span>
            <span style={{ color: "#a0a0a0" }}>{u.lastActive ?? "—"}</span>
            <StatusBadge status={u.status} />
            <span>
              {u.status === "INVITED" && <button onClick={() => resend(u.id)} disabled={resendingId === u.id} style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 8px", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                {resendingId === u.id ? "Sending…" : "Resend invitation"}
              </button>}
            </span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
