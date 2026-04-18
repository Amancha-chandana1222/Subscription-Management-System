import { useState, useEffect } from "react";
import { getTools, submitRequest } from "../../api/index.js";
import { ToolDot, SectionCard } from "../../components/index.jsx";

export default function EmployeeRequestAccess({ setActive }) {
  const [tools,     setTools]     = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [reason,    setReason]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTools()
      .then(t => setTools(t.data.filter(tool => tool.totalSeats - tool.assignedSeats > 0)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await submitRequest({ toolId: selected.id, reason });
      setSubmitted(true);
      setTimeout(() => setActive("emp-requests"), 1800);
    } catch (err) {
      alert("Submit failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: 340, gap: 16, textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, background: "#f0fdf4", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CheckIcon />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Request submitted</div>
        <div style={{ fontSize: 13, color: "#a0a0a0", maxWidth: 280 }}>
          Your request for <strong>{selected?.name}</strong> is pending admin approval. Redirecting…
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Request tool access</div>
        <div style={{ fontSize: 13, color: "#a0a0a0" }}>
          Choose a tool and provide a reason. Your request will be reviewed by an admin.
        </div>
      </div>

      {/* Tool picker */}
      <SectionCard title="Select a tool">
        {loading ? (
          <div style={{ fontSize: 13, color: "#a0a0a0" }}>Loading tools…</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 14px", borderRadius: 9, cursor: "pointer",
                  border: `1.5px solid ${selected?.id === t.id ? "#0a0a0a" : "#ebebeb"}`,
                  background: selected?.id === t.id ? "#fafafa" : "#ffffff",
                  transition: "all 0.12s", textAlign: "left",
                }}
              >
                <ToolDot abbr={t.abbr} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#a0a0a0", marginTop: 1 }}>
                    {t.totalSeats - t.assignedSeats} seats available
                  </div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${selected?.id === t.id ? "#0a0a0a" : "#d0d0d0"}`,
                  background: selected?.id === t.id ? "#0a0a0a" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {selected?.id === t.id && (
                    <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Reason form */}
      <SectionCard title="Justification">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#525252", marginBottom: 6 }}>
              Why do you need this tool?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. I need Figma to design mockups for the Q3 product revamp..."
              required
              rows={4}
              style={{
                width: "100%", background: "#f9f9f9", border: "1px solid #ebebeb",
                borderRadius: 8, padding: "10px 13px", fontSize: 13, color: "#0a0a0a",
                outline: "none", resize: "vertical", fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
              onBlur={(e)  => e.target.style.borderColor = "#ebebeb"}
            />
          </div>

          <button
            type="submit"
            disabled={!selected || !reason.trim() || submitting}
            style={{
              background: selected && reason.trim() ? "#0a0a0a" : "#f0f0f0",
              color: selected && reason.trim() ? "#ffffff" : "#a0a0a0",
              border: "none", borderRadius: 8, padding: "11px 0",
              fontSize: 14, fontWeight: 600,
              cursor: selected && reason.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
