import { NAV_ITEMS } from "../data/index.js";
import { Icons } from "./Icons.jsx";
import { Avatar } from "./index.jsx";
import { Link, useNavigate,useLocation} from "react-router-dom";

const iconMap = {
  dashboard: Icons.grid,
  analytics: Icons.chart,
  usage: Icons.clock,
  tools: Icons.monitor,
  licenses: Icons.file,
  users: Icons.users,
  requests: Icons.message,
  vault: Icons.lock,
  audit: Icons.list,
  settings: Icons.settings,
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const groups = [...new Set(NAV_ITEMS.map((n) => n.group))];
const onLogout = () => {
  localStorage.removeItem("licenseiq_token");
  localStorage.removeItem("licenseiq_user");
window.location.href = "/";
}

  return (
    <div
      style={{
        width: 240,
        background: "#0a0a0a",
        borderRight: "1px solid #1f1f1f",
        display: "flex",
        flexDirection: "column",
        padding: "0 12px 16px",
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #1f1f1f",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "#0066FF",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              border: "2px solid #fff",
              borderRadius: 3,
            }}
          />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
          LicenseIQ
        </span>
      </div>

      {/* Nav */}
<div style={{ flex: 1, overflow: "hidden" }}>
        {groups.map((group) => (
          <div key={group} style={{ marginBottom: 6 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6b7280",
                padding: "8px 10px 4px",
              }}
            >
              {group}
            </div>

            {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
              const isActive = location.pathname === `/${item.id}`;
              const Icon = iconMap[item.id];

              return (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 11px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#000" : "#d1d5db",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.color = "#000000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#d1d5db";
                      }
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {Icon && <Icon />}
                    </span>

                    <span style={{ flex: 1 }}>{item.label}</span>

                    {item.badge && (
                      <span
                        style={{
                          background: isActive ? "#000" : "#fff",
                          color: isActive ? "#fff" : "#000",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Section */}
      <div
        style={{
          borderTop: "1px solid #1f1f1f",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 10px",
          }}
        >
          <Avatar name="Arjun Kumar" size={32} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
              Arjun Kumar
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Admin</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#9ca3af",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <LogoutIcon /> Sign out
        </button>
      </div>
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}