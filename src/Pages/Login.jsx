import { useState } from "react";
import { login as apiLogin } from "../api/index.js";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMO_CREDENTIALS = {
    admin:    { email: "test@acme.com",    password: "admin123" },
    employee: { email: "newuser@acme.com", password: "admin123" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      if (onLogin) onLogin(data.role);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    const c = DEMO_CREDENTIALS[role];
    setEmail(c.email);
    setPassword(c.password);
  };

  if (!role) {
    return (
      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoBox} />
            <span style={styles.logoText}>LicenseIQ</span>
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.sub}>Select your role to continue</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            <RoleCard
              title="Admin"
              desc="Manage tools, licenses, users and costs"
              icon={<ShieldIcon />}
              onClick={() => setRole("admin")}
            />
            <RoleCard
              title="Employee"
              desc="View your tools and request new access"
              icon={<UserIcon />}
              onClick={() => setRole("employee")}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <a href="/forgot-password" style={{ fontSize: 12, color: "#525252" }}>Forgot Password?</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoBox} />
          <span style={styles.logoText}>LicenseIQ</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={styles.heading}>Sign in</h1>
            <p style={styles.sub}>Signing in as <strong>{role === "admin" ? "Admin" : "Employee"}</strong></p>
          </div>
          <button onClick={() => { setRole(null); setEmail(""); setPassword(""); setError(""); }}
            style={{ fontSize: 12, color: "#525252", background: "#f5f5f5", border: "1px solid #ebebeb", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
            Change
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={DEMO_CREDENTIALS[role].email}
              required style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
              onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
            />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
              onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, padding: "9px 12px" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: "#0a0a0a", color: "#fff", border: "none",
            borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
          }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <a href="/forgot-password" style={{ fontSize: 12, color: "#525252" }}>Forgot Password?</a>
        </div>

        <button onClick={fillDemo} style={{
          width: "100%", marginTop: 12, fontSize: 12, color: "#a0a0a0",
          background: "transparent", border: "none", cursor: "pointer", padding: "4px 0",
        }}>
          Fill demo credentials
        </button>
      </div>
    </div>
  );
}

function RoleCard({ title, desc, icon, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left",
        background: hovered ? "#0a0a0a" : "#ffffff",
        border: `1px solid ${hovered ? "#0a0a0a" : "#ebebeb"}`,
        transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: hovered ? "#1a1a1a" : "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "#ffffff" : "#525252", transition: "all 0.15s",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: hovered ? "#ffffff" : "#0a0a0a", transition: "color 0.15s" }}>{title}</div>
        <div style={{ fontSize: 12, color: hovered ? "#a0a0a0" : "#888", marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ marginLeft: "auto", color: hovered ? "#555" : "#d0d0d0", transition: "color 0.15s" }}>
        <ChevronIcon />
      </div>
    </button>
  );
}

const styles = {
  shell: {
    minHeight: "100vh", background: "#f9f9f9",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24,
  },
  card: {
    background: "#ffffff", border: "1px solid #ebebeb",
    borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 420,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 9, marginBottom: 32,
  },
  logoBox: {
    width: 26, height: 26, background: "#0a0a0a", borderRadius: 7,
  },
  logoText: {
    fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px",
  },
  heading: {
    fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4,
  },
  sub: {
    fontSize: 13, color: "#888",
  },
  label: {
    display: "block", fontSize: 12, fontWeight: 600, color: "#525252",
    marginBottom: 6, letterSpacing: "0.02em",
  },
  input: {
    width: "100%", background: "#f9f9f9", border: "1px solid #ebebeb",
    borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "#0a0a0a",
    outline: "none", transition: "border-color 0.15s",
  },
};

function ShieldIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
