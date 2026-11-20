import { Icons } from "./Icons.jsx";
import { Avatar } from "./index.jsx";
import { getCurrentUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "./NotificationsContext.jsx";
import { useEffect, useRef } from "react";

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
  profile:   "My Profile",
};

export default function Topbar({ active }) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { notifications, unreadCount, readIds, loading, error, refresh, markRead, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const orgLabel = user?.organizationName || "Organization";

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div style={{
      background: "#ffffff", borderBottom: "1px solid #ebebeb",
      padding: "0 24px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px" }}>
          {PAGE_TITLES[active] ?? "Dashboard"}
        </div>
        <div style={{ fontSize: 11, color: "#b0b0b0", marginTop: 1 }}>
          {monthLabel} · {orgLabel}
        </div>
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

        <div ref={notificationsRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Open notifications"
            aria-expanded={showNotifications}
            onClick={(event) => {
              event.stopPropagation();
              setShowNotifications((open) => !open);
            }}
            style={{
              position: "relative", background: "#f9f9f9", border: "1px solid #ebebeb",
              borderRadius: 7, padding: "6px 8px", cursor: "pointer",
              display: "flex", alignItems: "center", color: "#525252",
            }}
          >
            <Icons.bell />
            {unreadCount > 0 && <span style={{
              position: "absolute", top: -7, right: -7, minWidth: 17, height: 17,
              padding: "0 4px", borderRadius: 999, background: "#dc2626", color: "#fff",
              fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center",
            }}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>
          {showNotifications && (
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
              position: "absolute", zIndex: 20, right: 0, top: 42, width: "min(360px, calc(100vw - 32px))",
              maxHeight: 420, overflowY: "auto", background: "#fff",
              border: "1px solid #ebebeb", borderRadius: 10,
              boxShadow: "0 12px 30px rgba(0,0,0,.12)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #2c2c2c", background: "#111", color: "#fff" }}>
                <strong style={{ fontSize: 14 }}>Notifications</strong>
                {unreadCount > 0 && <button type="button" onClick={markAllRead} style={{ border: 0, background: "transparent", color: "#2563eb", fontSize: 11, cursor: "pointer" }}>Mark all read</button>}
              </div>
              {loading ? (
                <div style={{ padding: 24, textAlign: "center", color: "#888", fontSize: 13 }}>Loading notifications…</div>
              ) : error && notifications.length === 0 ? (
                <div style={{ padding: 20, color: "#b91c1c", fontSize: 13 }}>
                  <div>{error}</div>
                  <button type="button" onClick={() => refresh().catch(() => {})} style={{ marginTop: 10, border: 0, borderRadius: 6, padding: "6px 10px", background: "#111", color: "#fff", cursor: "pointer" }}>Retry</button>
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#888", fontSize: 13 }}>No notifications yet.</div>
              ) : notifications.map((notification) => {
                const unread = !readIds.includes(notification.id);
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      markRead(notification.id);
                      setShowNotifications(false);
                      if (notification.href) navigate(notification.href);
                    }}
                    style={{
                      width: "100%", textAlign: "left", border: 0, borderBottom: "1px solid #f5f5f5",
                      background: unread ? "#1f2937" : "#171717", padding: "12px 16px", cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, flexShrink: 0, borderRadius: 7,
                        display: "grid", placeItems: "center",
                        background: unread ? "#2563eb" : "#262626", color: "#fff",
                      }}>
                        <NotificationIcon category={notification.category} />
                      </span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                          <strong style={{ fontSize: 12, color: "#fff" }}>{notification.title}</strong>
                          <span style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap" }}>{notification.category}</span>
                        </span>
                        <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "#d1d5db" }}>{notification.description}</span>
                        <span style={{ display: "block", marginTop: 5, fontSize: 10, color: "#9ca3af" }}>{formatDate(notification.date)}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Open my profile"
          onClick={() => navigate("/profile")}
          style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
        >
          <Avatar name={user?.name ?? "User"} size={30} />
        </button>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function NotificationIcon({ category }) {
  const Icon = {
    Requests: Icons.message,
    Licenses: Icons.file,
    Tools: Icons.monitor,
    Users: Icons.users,
    Usage: Icons.chart,
  }[category] ?? Icons.bell;
  return <Icon />;
}
