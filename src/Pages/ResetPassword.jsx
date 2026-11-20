import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/index.js";

const shell = { minHeight: "100vh", background: "#f9f9f9", display: "grid", placeItems: "center", padding: 24 };
const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 32, width: "100%", maxWidth: 430 };
const formStyle = { display: "flex", flexDirection: "column", gap: 13 };
const labelStyle = { display: "flex", flexDirection: "column", gap: 5, fontSize: 13, fontWeight: 600 };
const inputStyle = { padding: "10px", borderRadius: 7, border: "1px solid #d1d5db", fontSize: 14 };
const buttonStyle = { padding: "11px", background: "#111", color: "#fff", border: 0, borderRadius: 7, fontWeight: 600, cursor: "pointer" };
function AccountCard({ title, children }) { return <div style={shell}><div style={card}><h1 style={{ marginTop: 0 }}>{title}</h1>{children}</div></div>; }
function Message({ error }) { return <p style={{ color: "#b91c1c", background: "#fef2f2", padding: 10, borderRadius: 6 }}>{error}</p>; }
function Password({ label, value, onChange }) { return <label style={labelStyle}>{label}<input required minLength="8" type="password" value={value} onChange={e => onChange(e.target.value)} style={inputStyle} /></label>; }

export function ForgotPassword() {
  const [email, setEmail] = useState(""), [message, setMessage] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const submit = async e => { e.preventDefault(); setLoading(true); setError(""); try { const r = await forgotPassword(email); setMessage(r.message || "If an active account exists for that email, a password reset link has been sent."); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  return <AccountCard title="Forgot Password">{message ? <p>{message}</p> : <form onSubmit={submit} style={formStyle}><label style={labelStyle}>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></label>{error && <Message error={error} />}<button disabled={loading} style={buttonStyle}>{loading ? "Sending…" : "Send reset link"}</button></form>}<p><Link to="/login">Back to Login</Link></p></AccountCard>;
}
export function ResetPassword() {
  const [params] = useSearchParams(); const token = params.get("token") || ""; const [password, setPassword] = useState(""), [confirmPassword, setConfirmPassword] = useState(""), [error, setError] = useState(""), [done, setDone] = useState(false), [loading, setLoading] = useState(false);
  const submit = async e => { e.preventDefault(); if (password !== confirmPassword) return setError("Passwords do not match."); setLoading(true); setError(""); try { await resetPassword({ token, password, confirmPassword }); setDone(true); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  return <AccountCard title="Reset Password">{done ? <><p>Your password has been reset successfully.</p><Link to="/login">Go to Login</Link></> : <form onSubmit={submit} style={formStyle}>{error && <Message error={error} />}<Password label="New Password" value={password} onChange={setPassword} /><Password label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} /><button disabled={loading} style={buttonStyle}>{loading ? "Resetting…" : "Reset Password"}</button></form>}</AccountCard>;
}
