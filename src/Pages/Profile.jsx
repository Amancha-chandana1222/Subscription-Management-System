import { useEffect, useState } from "react";
import { SectionCard, Btn } from "../components/index.jsx";
import {
  changeMyPassword,
  getCurrentUser,
  getMyProfile,
  updateCurrentUser,
  updateMyProfile,
} from "../api/index.js";

const initialPassword = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((profileResponse) => {
        setProfile(profileResponse?.data ?? profileResponse);
      })
      .catch((err) => setError(err.message || "Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await updateMyProfile({
        name: profile.name,
        department: profile.department ?? "",
      });
      const updated = response?.data ?? response;
      const current = getCurrentUser();
      if (current) {
        updateCurrentUser({
          ...current,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          department: updated.department ?? null,
        });
      }
      setProfile(updated);
      setMessage(response?.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setMessage("");
    setError("");
    try {
      await changeMyPassword(password);
      setPassword(initialPassword);
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update your password.");
    }
  };

  if (loading) return <div style={{ padding: 32, color: "#888", fontSize: 13 }}>Loading profile…</div>;
  if (!profile) {
    return <SectionCard title="Profile unavailable"><p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p></SectionCard>;
  }

  const organizationName = getCurrentUser()?.organizationName ?? "Organization";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 660 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22 }}>My Profile</h1>
        <p style={{ margin: "6px 0 0", color: "#888", fontSize: 13 }}>
          Manage your personal information and account security.
        </p>
      </div>

      {message && <Notice color="#166534" background="#f0fdf4">{message}</Notice>}
      {error && <Notice color="#dc2626" background="#fef2f2">{error}</Notice>}

      <SectionCard title="Personal information">
        <Field label="Full name" value={profile.name ?? ""} onChange={(value) => setProfile({ ...profile, name: value })} />
        <Field label="Email" value={profile.email ?? ""} readOnly />
        <Field label="Role" value={profile.role ?? ""} readOnly />
        <Field label="Department" value={profile.department ?? ""} onChange={(value) => setProfile({ ...profile, department: value })} />
        <Field label="Organization" value={organizationName} readOnly />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="primary" onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Btn>
        </div>
      </SectionCard>

      <SectionCard title="Change password">
        <Field label="Current password" type="password" value={password.currentPassword} onChange={(value) => setPassword({ ...password, currentPassword: value })} />
        <Field label="New password" type="password" value={password.newPassword} onChange={(value) => setPassword({ ...password, newPassword: value })} />
        <Field label="Confirm new password" type="password" value={password.confirmPassword} onChange={(value) => setPassword({ ...password, confirmPassword: value })} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <Btn onClick={savePassword}>Update password</Btn>
        </div>
      </SectionCard>
    </div>
  );
}

function Field({ label, value, onChange, readOnly = false, type = "text" }) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", alignItems: "center", gap: 16, marginBottom: 14, fontSize: 13, color: "#525252", fontWeight: 500 }}>
      {label}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        style={{ background: readOnly ? "#f3f4f6" : "#f9f9f9", border: "1px solid #ebebeb", borderRadius: 7, padding: "8px 12px", fontSize: 13, color: readOnly ? "#6b7280" : "#0a0a0a", outline: "none" }}
      />
    </label>
  );
}

function Notice({ children, color, background }) {
  return <div style={{ fontSize: 13, color, background, border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>{children}</div>;
}
