import { useState } from "react";
import { getCurrentUser } from "../../api/index.js";
import { SectionCard, Btn } from "../../components/index.jsx";

export default function EmployeeProfile() {
  const user = getCurrentUser();
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const [notifs, setNotifs] = useState({
    approvals:  true,
    renewals:   true,
    inactivity: false,
  });

  const toggle = (key) => setNotifs((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>

      {/* Profile header */}
      <div style={{
        background: "#0a0a0a", borderRadius: 12, padding: "28px",
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "#1a1a1a",
          color: "#fff", fontSize: 18, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{user?.name ?? "Unknown"}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{user?.email ?? "—"}</div>
          <div style={{ fontSize: 12, color: "#444", marginTop: 6 }}>Employee · Acme Corp</div>
        </div>
      </div>

      {/* Personal info */}
      <SectionCard title="Personal information">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Full name",  value: user?.name  ?? "" },
            { label: "Email",      value: user?.email ?? "" },
            { label: "Department", value: "Engineering" },
            { label: "Joined",     value: "January 2024" },
          ].map((f) => (
            <div key={f.label} style={{
              display: "grid", gridTemplateColumns: "1fr 1.6fr",
              alignItems: "center", gap: 16,
            }}>
              <label style={{ fontSize: 13, color: "#525252", fontWeight: 500 }}>{f.label}</label>
              <input
                defaultValue={f.value}
                style={{
                  background: "#f9f9f9", border: "1px solid #ebebeb",
                  borderRadius: 7, padding: "8px 12px", fontSize: 13,
                  color: "#0a0a0a", outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
                onBlur={(e)  => e.target.style.borderColor = "#ebebeb"}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <Btn variant="primary">Save changes</Btn>
          </div>
        </div>
      </SectionCard>

      {/* Notification preferences */}
      <SectionCard title="Notification preferences">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { key: "approvals",  label: "Request approvals",   desc: "When your access request is approved or rejected" },
            { key: "renewals",   label: "License renewals",    desc: "When a tool you use is due for renewal" },
            { key: "inactivity", label: "Inactivity warnings", desc: "When your license may be revoked due to inactivity" },
          ].map((n, i, arr) => (
            <div key={n.key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</div>
                <div style={{ fontSize: 12, color: "#a0a0a0", marginTop: 2 }}>{n.desc}</div>
              </div>
              <Toggle on={notifs[n.key]} onClick={() => toggle(n.key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Change password */}
      <SectionCard title="Change password">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["Current password", "New password", "Confirm new password"].map((label) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#525252", marginBottom: 5 }}>{label}</label>
              <input
                type="password" placeholder="••••••••"
                style={{
                  width: "100%", background: "#f9f9f9", border: "1px solid #ebebeb",
                  borderRadius: 7, padding: "8px 12px", fontSize: 13,
                  color: "#0a0a0a", outline: "none",
                }}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <Btn variant="primary">Update password</Btn>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 22, borderRadius: 99, border: "none",
      background: on ? "#0a0a0a" : "#e0e0e0",
      cursor: "pointer", position: "relative", flexShrink: 0,
      transition: "background 0.2s",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: on ? 21 : 3,
        transition: "left 0.2s",
      }} />
    </button>
  );
}
