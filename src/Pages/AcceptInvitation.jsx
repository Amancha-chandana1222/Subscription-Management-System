import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { acceptInvitation, validateInvitation } from "../api/index.js";

export default function AcceptInvitation() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [invite, setInvite] = useState(null), [password, setPassword] = useState(""), [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [done, setDone] = useState(false);
  useEffect(() => { validateInvitation(token).then(r => setInvite(r.data ?? r)).catch(e => setError(e.message || "Invalid invitation link.")).finally(() => setLoading(false)); }, [token]);
  const submit = async (e) => { e.preventDefault(); if (password !== confirmPassword) return setError("Passwords do not match."); setSaving(true); setError(""); try { await acceptInvitation({ token, password, confirmPassword }); setDone(true); } catch (e) { setError(e.message || "Unable to activate account."); } finally { setSaving(false); } };
  return <AccountCard title="Accept Invitation">
    {loading && <p>Checking invitation…</p>}
    {!loading && error && <Message error={error} />}
    {done && <><p>Your account has been activated successfully.</p><Link to="/login">Go to Login</Link></>}
    {!loading && invite && !done && <form onSubmit={submit} style={formStyle}>
      <ReadOnly label="Name" value={invite.name} /><ReadOnly label="Email" value={invite.email} /><ReadOnly label="Organization" value={invite.organization} />
      <Password label="New Password" value={password} onChange={setPassword} /><Password label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
      <small>Password must have 8+ characters with uppercase, lowercase, and a number.</small><button disabled={saving} style={buttonStyle}>{saving ? "Setting password…" : "Set Password"}</button>
    </form>}
  </AccountCard>;
}
function AccountCard({ title, children }) { return <div style={shell}><div style={card}><h1 style={{ marginTop: 0 }}>{title}</h1>{children}</div></div>; }
function Message({ error }) { return <p style={{ color: "#b91c1c", background: "#fef2f2", padding: 10, borderRadius: 6 }}>{error}</p>; }
function ReadOnly({ label, value }) { return <label style={labelStyle}>{label}<input value={value || ""} readOnly style={inputStyle} /></label>; }
function Password({ label, value, onChange }) { return <label style={labelStyle}>{label}<input required minLength="8" type="password" value={value} onChange={e => onChange(e.target.value)} style={inputStyle} /></label>; }
const shell = { minHeight: "100vh", background: "#f9f9f9", display: "grid", placeItems: "center", padding: 24 };
const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 32, width: "100%", maxWidth: 430 };
const formStyle = { display: "flex", flexDirection: "column", gap: 13 };
const labelStyle = { display: "flex", flexDirection: "column", gap: 5, fontSize: 13, fontWeight: 600 };
const inputStyle = { padding: "10px", borderRadius: 7, border: "1px solid #d1d5db", fontSize: 14 };
const buttonStyle = { padding: "11px", background: "#111", color: "#fff", border: 0, borderRadius: 7, fontWeight: 600, cursor: "pointer" };
