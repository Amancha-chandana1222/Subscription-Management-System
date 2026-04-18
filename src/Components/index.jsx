// StatusBadge.jsx
export function StatusBadge({ status }) {
  const map = {
    ACTIVE:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Active" },
    INACTIVE: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Inactive" },
    PENDING:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Pending" },
    WARNING:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Warning" },
    APPROVED: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Approved" },
    REJECTED: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Rejected" },
    info:     { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "Info" },
    success:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Success" },
    danger:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Danger" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      display: "inline-block", whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

// TableHeader.jsx
export function TableHeader({ cols, gridCols }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: gridCols,
      fontSize: 11, fontWeight: 600, color: "#a0a0a0",
      letterSpacing: "0.05em", textTransform: "uppercase",
      padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
    }}>
      {cols.map((c) => <span key={c}>{c}</span>)}
    </div>
  );
}

// StatCard.jsx
export function StatCard({ label, value, sub, dark, danger, progress }) {
  return (
    <div style={{
      background: dark ? "#0a0a0a" : "#ffffff",
      border: `1px solid ${dark ? "#1a1a1a" : "#ebebeb"}`,
      borderRadius: 12, padding: "18px 20px",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
        textTransform: "uppercase", color: dark ? "#666" : "#a0a0a0",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, marginTop: 6, letterSpacing: "-1px",
        color: dark ? "#ffffff" : danger ? "#dc2626" : "#0a0a0a",
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: dark ? "#555" : "#a0a0a0", marginTop: 4 }}>
          {sub}
        </div>
      )}
      {progress != null && (
        <div style={{ marginTop: 10, background: "#f0f0f0", borderRadius: 99, height: 4, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, background: "#0a0a0a", height: "100%", borderRadius: 99 }} />
        </div>
      )}
    </div>
  );
}

// ToolDot.jsx
export function ToolDot({ abbr, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, background: "#0a0a0a", borderRadius: 8,
      color: "#fff", fontSize: size * 0.34, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {abbr}
    </div>
  );
}

// Avatar.jsx
export function Avatar({ name, size = 30 }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#0a0a0a",
      color: "#fff", fontSize: size * 0.36, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ProgressBar.jsx
export function ProgressBar({ value, max = 100, colored = false }) {
  const pct = Math.round((value / max) * 100);
  const color = colored
    ? pct < 50 ? "#dc2626" : pct < 75 ? "#d97706" : "#0a0a0a"
    : "#0a0a0a";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 99, height: 5, overflow: "hidden", maxWidth: 80 }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 11, color: "#a0a0a0", minWidth: 28 }}>{pct}%</span>
    </div>
  );
}

// PageShell.jsx  — white card wrapper for page content
export function PageShell({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {children}
    </div>
  );
}

// SectionCard.jsx
export function SectionCard({ title, action, children, noPadding }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>
      {title && (
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{title}</span>
          {action}
        </div>
      )}
      <div style={noPadding ? {} : { padding: 20 }}>
        {children}
      </div>
    </div>
  );
}

// Btn.jsx
export function Btn({ children, variant = "primary", onClick, small }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: small ? "5px 12px" : "7px 16px",
    borderRadius: 7, fontSize: small ? 12 : 13, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "opacity 0.12s",
  };
  const variants = {
    primary:   { background: "#0a0a0a", color: "#ffffff" },
    secondary: { background: "#ffffff", color: "#0a0a0a", border: "1px solid #ebebeb" },
    ghost:     { background: "#f5f5f5", color: "#525252", border: "1px solid #ebebeb" },
    danger:    { background: "transparent", color: "#dc2626", border: "1px solid #fecaca" },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
}
