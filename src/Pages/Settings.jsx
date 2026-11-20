import { useEffect, useState } from "react";
import { SectionCard, Btn } from "../components/index.jsx";
import {
  getCurrentUser,
  getMyNotificationPreferences,
  getOrganization,
  updateMyNotificationPreferences,
  updateOrganization,
} from "../api/index.js";

export default function SettingsPage() {
  const user = getCurrentUser();
  const canEditOrganization = user?.role === "ADMIN";
  const [form, setForm] = useState({ name: "", domain: "" });
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadOrganization = async () => {
    setLoading(true);
    setError(null);
    try {
      const [organizationResponse, preferencesResponse] = await Promise.all([
        getOrganization(),
        getMyNotificationPreferences(),
      ]);
      const data = organizationResponse?.data ?? organizationResponse;
      setForm({
        name: data?.name ?? "",
        domain: data?.domain ?? "",
      });
      setPreferences(preferencesResponse?.data ?? preferencesResponse);
    } catch (err) {
      setError(err.message || "Failed to load organization settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganization();
  }, []);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setMessage(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.domain?.trim()) {
      setError("Organization name and domain are required.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await updateOrganization({
        name: form.name.trim(),
        domain: form.domain.trim(),
      });
      const data = res?.data ?? res;
      setForm({
        name: data.name ?? form.name,
        domain: data.domain ?? form.domain,
      });

      // Keep localStorage org label in sync for Topbar/Sidebar, but DB remains source of truth
      const stored = getCurrentUser();
      if (stored) {
        localStorage.setItem(
          "licenseiq_user",
          JSON.stringify({
            ...stored,
            organizationName: data.name,
            organizationId: data.id ?? stored.organizationId,
          })
        );
      }

      setMessage(res?.message || "Organization updated successfully");
    } catch (err) {
      setError(err.message || "Failed to save organization settings.");
    } finally {
      setSaving(false);
    }
  };

  const savePreference = async (key, value) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    try {
      const response = await updateMyNotificationPreferences(next);
      setPreferences(response?.data ?? response);
      setMessage("Notification preferences updated.");
    } catch (err) {
      setError(err.message || "Failed to update notification preferences.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, color: "#a0a0a0", fontSize: 13 }}>
        Loading settings…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 660 }}>
      <div style={{ fontSize: 13, color: "#666" }}>
        Signed in as <strong>{user?.name}</strong> ({user?.email}) — {user?.role}
      </div>

      {message && (
        <div style={{
          fontSize: 13, color: "#166534", background: "#f0fdf4",
          border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px",
        }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{
          fontSize: 13, color: "#dc2626", background: "#fef2f2",
          border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px",
        }}>
          {error}
        </div>
      )}

      <SectionCard title="Organization">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "name", label: "Company name", type: "text" },
            { key: "domain", label: "Domain", type: "text" },
          ].map((f) => (
            <div key={f.key} style={{
              display: "grid", gridTemplateColumns: "1fr 1.6fr",
              alignItems: "center", gap: 16,
            }}>
              <label style={{ fontSize: 13, color: "#525252", fontWeight: 500 }}>
                {f.label}
              </label>
              <input
                value={form[f.key]}
                onChange={setField(f.key)}
                type={f.type}
                readOnly={!canEditOrganization}
                style={{
                  background: canEditOrganization ? "#f9f9f9" : "#f3f4f6", border: "1px solid #ebebeb",
                  borderRadius: 7, padding: "8px 12px",
                  fontSize: 13, color: "#0a0a0a", outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
                onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
              />
            </div>
          ))}

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1.6fr",
            alignItems: "center", gap: 16,
          }}>
            <label style={{ fontSize: 13, color: "#525252", fontWeight: 500 }}>
              Account email
            </label>
            <input
              value={user?.email ?? ""}
              type="email"
              readOnly
              style={{
                background: "#f3f4f6", border: "1px solid #ebebeb",
                borderRadius: 7, padding: "8px 12px",
                fontSize: 13, color: "#6b7280", outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            {canEditOrganization && (
              <Btn variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Btn>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="About this page">
        <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 }}>
          {canEditOrganization
            ? "Organization name and domain are saved to the database for your workspace only."
            : "Organization details are managed by an administrator. You can update your personal information from My Profile."}
        </p>
      </SectionCard>

      {preferences && (
        <SectionCard title="Notifications">
          {[
            ["requestApprovalsEnabled", "Request approvals"],
            ["licenseRenewalsEnabled", "License renewals"],
            ["inactivityWarningsEnabled", "Inactivity warnings"],
          ].map(([key, label]) => (
            <label key={key} style={{ display: "flex", gap: 10, padding: "8px 0", fontSize: 13 }}>
              <input
                type="checkbox"
                checked={Boolean(preferences[key])}
                onChange={(event) => savePreference(key, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </SectionCard>
      )}

    </div>
  );
}
