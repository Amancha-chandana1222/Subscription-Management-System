import { useState, useEffect } from "react";
import { getTools, createTool } from "../api/index.js";
import { SectionCard, ToolDot, ProgressBar, Btn } from "../components/index.jsx";
import { StatusBadge } from "../components/index.jsx";
import { Icons } from "../components/Icons.jsx";

// ── Add Tool Modal ────────────────────────────────────────────────────────────

function AddToolModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "", abbr: "", totalSeats: "", costMonthly: "", renewalDate: "", websiteUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.abbr || !form.totalSeats || !form.costMonthly || !form.renewalDate)
      return setError("Name, abbreviation, seats, cost and renewal date are required.");

    setLoading(true);
    setError(null);
    try {
      await createTool({
        name:        form.name,
        abbr:        form.abbr,
        totalSeats:  parseInt(form.totalSeats),
        costMonthly: parseFloat(form.costMonthly),
        renewalDate: form.renewalDate,
        websiteUrl:  form.websiteUrl || null,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message ?? "Failed to create tool.");
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
        background: "#fff", borderRadius: 12, padding: 28, width: 440,
        display: "flex", flexDirection: "column", gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Add Tool</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Tool name">
            <input style={inputStyle} placeholder="e.g. Figma"
              value={form.name} onChange={set("name")} />
          </Field>
          <Field label="Abbreviation">
            <input style={inputStyle} placeholder="e.g. FIG" maxLength={5}
              value={form.abbr} onChange={set("abbr")}
              onBlur={() => setForm((f) => ({ ...f, abbr: f.abbr.toUpperCase() }))}
            />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Total seats">
            <input style={inputStyle} type="number" min={1} placeholder="e.g. 20"
              value={form.totalSeats} onChange={set("totalSeats")} />
          </Field>
          <Field label="Monthly cost ($)">
            <input style={inputStyle} type="number" min={0} step="0.01" placeholder="e.g. 99.99"
              value={form.costMonthly} onChange={set("costMonthly")} />
          </Field>
        </div>

        <Field label="Renewal date">
          <input style={inputStyle} type="date"
            value={form.renewalDate} onChange={set("renewalDate")} />
        </Field>

        <Field label="Website URL (optional)">
          <input style={inputStyle} placeholder="e.g. https://figma.com"
            value={form.websiteUrl} onChange={set("websiteUrl")} />
        </Field>

        {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Btn variant="ghost" small onClick={onClose} disabled={loading}>Cancel</Btn>
          <Btn variant="primary" small onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating…" : "Create tool"}
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

export default function ToolsPage() {
  const [tools,   setTools]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    setLoading(true);
    getTools()
      .then((t) => setTools(t.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {showAdd && (
        <AddToolModal
          onClose={() => setShowAdd(false)}
          onSuccess={load}
        />
      )}

      <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            style={{
              width: "90%", background: "#ffffff", border: "1px solid #ebebeb",
              borderRadius: 7, padding: "8px 12px 8px 34px",
              fontSize: 13, color: "#0a0a0a", outline: "none",
            }}
          />
          <span style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", opacity: 0.3, display: "flex",
          }}>
            <Icons.search />
          </span>
        </div>
        <Btn variant="primary" onClick={() => setShowAdd(true)}>
          <Icons.plus /> Add tool
        </Btn>
      </div>

      <SectionCard noPadding>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 80px 110px 100px 120px 80px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>Tool</span><span>Seats</span><span>Monthly</span>
          <span>Renewal</span><span>Utilization</span><span>Status</span>
        </div>

        {loading && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading tools…
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            {search ? `No tools match "${search}"` : "No tools found"}
          </div>
        )}

        {filtered.map((t) => (
          <div key={t.id} style={{
            display: "grid", gridTemplateColumns: "2fr 80px 110px 100px 120px 80px",
            padding: "14px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
            cursor: "pointer", transition: "background 0.1s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ToolDot abbr={t.abbr} size={32} />
              <div>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#b0b0b0" }}>
                  {t.websiteUrl
                    ? <a href={t.websiteUrl} target="_blank" rel="noreferrer"
                        style={{ color: "#b0b0b0", textDecoration: "none" }}
                        onClick={(e) => e.stopPropagation()}>
                        {t.websiteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    : "SaaS subscription"
                  }
                </div>
              </div>
            </div>
            <span style={{ color: "#525252" }}>{t.assignedSeats}/{t.totalSeats}</span>
            <span style={{ fontWeight: 600 }}>${t.costMonthly.toLocaleString()}</span>
            <span style={{ color: "#525252" }}>{t.renewalDate}</span>
            <ProgressBar value={t.assignedSeats} max={t.totalSeats} />
            <StatusBadge status={t.status} />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}