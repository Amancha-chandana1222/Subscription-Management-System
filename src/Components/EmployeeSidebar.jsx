import { Icons } from "./Icons.jsx";
import { Avatar } from "./index.jsx";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser, logout as apiLogout } from "../api/index.js";

const EMP_NAV = [
  { id: "emp-home",     label: "My tools",       group: "Overview", icon: "grid"    },
  { id: "emp-request",  label: "Request access", group: "Overview", icon: "plus"    },
  { id: "emp-requests", label: "My requests",    group: "Overview", icon: "message" },
  { id: "settings",     label: "Settings",       group: "Account",  icon: "settings" },
];

const iconMap = {
  grid:    Icons.grid,
  plus:    Icons.plus,
  message: Icons.message,
  settings: Icons.settings,
};

function LogoutIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function EmployeeSidebar({ user: userProp }) {
  const location = useLocation();
  const user = userProp ?? getCurrentUser();
  const groups   = [...new Set(EMP_NAV.map((n) => n.group))];

  const onLogout = () => {
    apiLogout();
    window.location.href = "/";
  };

  return (
    <div style={{
      width: 220, background: "#ffffff", borderRight: "1px solid #ebebeb",
      display: "flex", flexDirection: "column", padding: "0 10px 16px",
      flexShrink: 0, height: "100vh",
    }}>

      {/* Logo */}
      <div style={{
        padding: "20px 10px 16px", display: "flex", alignItems: "center",
        gap: 9, borderBottom: "1px solid #f0f0f0", marginBottom: 8,
      }}>
        <div style={{
          width: 26, height: 26, background: "#0a0a0a", borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 10, height: 10, border: "1.5px solid #fff", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.3px" }}>LicenseIQ</span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {groups.map((group) => (
          <div key={group} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "#b0b0b0", padding: "12px 10px 5px",
            }}>
              {group}
            </div>

            {EMP_NAV.filter((n) => n.group === group).map((item) => {
              const isActive = location.pathname === `/${item.id}`;
              const Icon     = iconMap[item.icon];
              return (
                <Link key={item.id} to={`/${item.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 9, width: "100%",
                    padding: "7px 10px", borderRadius: 7, cursor: "pointer",
                    fontSize: 13, fontWeight: 500, transition: "all 0.12s",
                    background: isActive ? "#0a0a0a" : "transparent",
                    color:      isActive ? "#ffffff" : "#525252",
                  }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#f5f5f5";
                        e.currentTarget.style.color = "#0a0a0a";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#525252";
                      }
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.65, display: "flex", alignItems: "center" }}>
                      {Icon && <Icon />}
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User + logout */}
      <div style={{
        marginTop: "auto", borderTop: "1px solid #f0f0f0",
        paddingTop: 14, display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 10px" }}>
          <Avatar name={user?.name ?? "Employee"} size={30} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user?.name ?? "Employee"}</div>
            <div style={{ fontSize: 11, color: "#a0a0a0" }}>{user?.role ?? "EMPLOYEE"}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px", borderRadius: 7, border: "none",
            background: "transparent", color: "#a0a0a0",
            fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left", width: "100%",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a0a0a0"; }}
        >
          <LogoutIcon /> Sign out
        </button>
      </div>
    </div>
  );
}