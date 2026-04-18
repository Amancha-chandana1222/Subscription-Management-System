import { useState, useEffect } from "react";
import { getVault, revealCredential, getTools, createCredential } from "../api/index.js";
import { SectionCard, Btn } from "../components/index.jsx";
import { Icons } from "../components/Icons.jsx";

// ── Add Credential Modal ──────────────────────────────────────────────────────

function AddCredentialModal({ onClose, onSuccess }) {
  const [tools,   setTools]   = useState([]);
  const [form,    setForm]    = useState({ toolId: "", keyName: "", value: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getTools()
      .then(res => setTools(res.data))
      .catch(() => setError("Failed to load tools."));
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.toolId || !form.keyName || !form.value)
      return setError("All fields are required.");
    setLoading(true);
    setError(null);
    try {
      await createCredential({
        toolId:  form.toolId,
        keyName: form.keyName,
        value:   form.value,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message ?? "Failed to store credential.");
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
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Store Credential</h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a0a0a0" }}>
            Value will be encrypted before storage.
          </p>
        </div>

        <Field label="Tool">
          <select style={inputStyle} value={form.toolId} onChange={set("toolId")}>
            <option value="">— select tool —</option>
            {tools.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Key name">
          <input style={inputStyle} placeholder="e.g. API_KEY, CLIENT_SECRET"
            value={form.keyName} onChange={set("keyName")} />
        </Field>

        <Field label="Value">
          <input style={inputStyle} type="password" placeholder="Paste the secret value"
            value={form.value} onChange={set("value")} />
        </Field>

        {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Btn variant="ghost" small onClick={onClose} disabled={loading}>Cancel</Btn>
          <Btn variant="primary" small onClick={handleSubmit} disabled={loading}>
            {loading ? "Storing…" : "Store credential"}
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

export default function VaultPage() {
  const [credentials, setCredentials] = useState([]);
  const [revealed,    setRevealed]    = useState({});
  const [loading,     setLoading]     = useState(true);
  const [showAdd,     setShowAdd]     = useState(false);

  const load = () => {
    setLoading(true);
    getVault()
      .then(res => setCredentials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (cred) => {
    const id = cred.id;
    if (revealed[id]) {
      setRevealed(prev => ({ ...prev, [id]: null }));
    } else {
      try {
        const res = await revealCredential(id);
        setRevealed(prev => ({ ...prev, [id]: res.data.plainValue }));
      } catch (e) {
        alert("Could not reveal credential: " + e.message);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {showAdd && (
        <AddCredentialModal
          onClose={() => setShowAdd(false)}
          onSuccess={load}
        />
      )}

      {/* Warning banner */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
        padding: "12px 16px", fontSize: 13, color: "#92400e",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ display: "flex", flexShrink: 0 }}><Icons.warning /></span>
        Credential access is logged. All reveals are recorded in the audit log.
      </div>

      <SectionCard
        title="Stored credentials"
        noPadding
        action={
          <Btn variant="primary" small onClick={() => setShowAdd(true)}>
            <Icons.plus /> Add credential
          </Btn>
        }
      >
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 2fr 80px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>Tool</span><span>Key name</span><span>Value</span><span></span>
        </div>

        {loading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading vault…
          </div>
        )}

        {!loading && credentials.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            No credentials stored yet.{" "}
            <span onClick={() => setShowAdd(true)}
              style={{ color: "#0a0a0a", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
              Add one
            </span>
          </div>
        )}

        {credentials.map((c) => {
          const isRevealed = !!revealed[c.id];
          return (
            <div key={c.id} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 2fr 80px",
              padding: "14px 20px", borderBottom: "1px solid #f9f9f9",
              alignItems: "center", fontSize: 13,
            }}>
              <span style={{ fontWeight: 600 }}>{c.toolName}</span>

              <span style={{ color: "#525252" }}>{c.keyName}</span>

              <code style={{
                fontFamily: "ui-monospace, monospace", fontSize: 12,
                color: isRevealed ? "#0a0a0a" : "#d0d0d0",
                background: "#f9f9f9", padding: "4px 10px", borderRadius: 5,
                letterSpacing: isRevealed ? "0" : "0.12em",
                border: "1px solid #f0f0f0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {isRevealed ? revealed[c.id] : c.maskedValue}
              </code>

              <button
                onClick={() => toggle(c)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 500, background: "transparent",
                  color: isRevealed ? "#dc2626" : "#525252",
                  border: `1px solid ${isRevealed ? "#fecaca" : "#ebebeb"}`,
                  borderRadius: 6, padding: "5px 10px",
                  cursor: "pointer", transition: "all 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isRevealed ? "#fef2f2" : "#f5f5f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {isRevealed ? <Icons.eyeOff /> : <Icons.eye />}
                {isRevealed ? "Hide" : "Show"}
              </button>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}