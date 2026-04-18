import { SectionCard, Btn } from "../components/index.jsx";

const SECTIONS = [
  {
    title: "Organization",
    fields: [
      { label: "Company name",        value: "Acme Corp",  type: "text" },
      { label: "Fiscal year start",   value: "January",    type: "text" },
      { label: "Default currency",    value: "USD",        type: "text" },
      { label: "Admin email",         value: "arjun@acme.com", type: "email" },
    ],
  },
  {
    title: "Automation rules",
    fields: [
      { label: "Inactivity threshold (days)", value: "30", type: "number" },
      { label: "Auto-revoke after (days)",    value: "60", type: "number" },
      { label: "Renewal alert (days before)", value: "14", type: "number" },
    ],
  },
  {
    title: "Integrations",
    fields: [
      { label: "Slack webhook URL",        value: "",           type: "url"  },
      { label: "Google Workspace domain",  value: "acme.com",   type: "text" },
      { label: "GitHub org name",          value: "acme-corp",  type: "text" },
    ],
  },
  {
    title: "Notifications",
    fields: [
      { label: "Renewal reminder subject", value: "Upcoming renewal — {tool}", type: "text" },
      { label: "Inactivity alert subject", value: "License inactive — {user}", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 660 }}>
      {SECTIONS.map((section) => (
        <SectionCard key={section.title} title={section.title}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {section.fields.map((f) => (
              <div key={f.label} style={{
                display: "grid", gridTemplateColumns: "1fr 1.6fr",
                alignItems: "center", gap: 16,
              }}>
                <label style={{ fontSize: 13, color: "#525252", fontWeight: 500 }}>
                  {f.label}
                </label>
                <input
                  defaultValue={f.value}
                  type={f.type}
                  placeholder={f.value ? "" : "Not configured"}
                  style={{
                    background: "#f9f9f9", border: "1px solid #ebebeb",
                    borderRadius: 7, padding: "8px 12px",
                    fontSize: 13, color: "#0a0a0a", outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#0a0a0a"}
                  onBlur={(e)  => e.target.style.borderColor = "#ebebeb"}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <Btn variant="primary">Save changes</Btn>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
