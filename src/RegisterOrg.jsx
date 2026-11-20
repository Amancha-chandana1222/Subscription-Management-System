import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "./api";

export default function RegisterOrg() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", domain: "", adminName: "", adminEmail: "", adminPassword: "",
  });
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.domain || !form.adminName || !form.adminEmail || !form.adminPassword)
      return setError("All fields are required.");
    setLoading(true);
    setError(null);
    try {
      const res = await createOrganization(form);
      if (res.success) navigate("/login");
      else setError(res.error ?? res.message ?? "Registration failed.");
    } catch (err) {
      if (err?.isNetworkError) {
        setError("Unable to connect to server.");
      } else {
        setError(err?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f9f9f9",
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, padding: 36, width: 420,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex",
        flexDirection: "column", gap: 16,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Create your organization</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#a0a0a0" }}>
            Set up LicenseIQ for your company
          </p>
        </div>

        {[
          { key: "name",          label: "Organization name", placeholder: "Acme Inc." },
          { key: "domain",        label: "Domain",            placeholder: "acme.com"  },
          { key: "adminName",     label: "Your name",         placeholder: "Jane Smith" },
          { key: "adminEmail",    label: "Work email",        placeholder: "jane@acme.com", type: "email" },
          { key: "adminPassword", label: "Password",          placeholder: "••••••••",      type: "password" },
        ].map(({ key, label, placeholder, type = "text" }) => (
          <label key={key} style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13, fontWeight: 500, color: "#374151" }}>
            {label}
            <input type={type} placeholder={placeholder} value={form[key]}
              onChange={set(key)} style={inputStyle} />
          </label>
        ))}

        {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          padding: "10px 0", borderRadius: 8, border: "none",
          background: "#0a0a0a", color: "#fff", fontSize: 13,
          fontWeight: 600, cursor: "pointer", marginTop: 4,
        }}>
          {loading ? "Creating…" : "Create organization"}
        </button>

        <p style={{ margin: 0, fontSize: 12, color: "#a0a0a0", textAlign: "center" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}
            style={{ color: "#0a0a0a", fontWeight: 600, cursor: "pointer" }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb",
  fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
};
