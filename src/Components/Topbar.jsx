import { Icons } from "./Icons.jsx";
import { Avatar } from "./index.jsx";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  analytics: "Cost analytics",
  usage:     "Usage report",
  tools:     "Tools",
  licenses:  "Licenses",
  users:     "Users",
  requests:  "Access requests",
  vault:     "Credential vault",
  audit:     "Audit log",
  settings:  "Settings",
};

export default function Topbar({ active }) {
  return (
    <div style={{
      background: "#ffffff", borderBottom: "1px solid #ebebeb",
      padding: "0 24px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px" }}>
          {PAGE_TITLES[active]}
        </div>
        <div style={{ fontSize: 11, color: "#b0b0b0", marginTop: 1 }}>April 2026 · Acme Corp</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search..."
            style={{
              background: "#f9f9f9", border: "1px solid #ebebeb", borderRadius: 7,
              padding: "6px 12px 6px 32px", fontSize: 12, color: "#0a0a0a",
              outline: "none", width: 180,
            }}
          />
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            opacity: 0.3, display: "flex", pointerEvents: "none",
          }}>
            <Icons.search />
          </span>
        </div>

        <button style={{
          background: "#f9f9f9", border: "1px solid #ebebeb", borderRadius: 7,
          padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center",
          color: "#525252",
        }}>
          <Icons.bell />
        </button>

        <Avatar name="Arjun Kumar" size={30} />
      </div>
    </div>
  );
}
