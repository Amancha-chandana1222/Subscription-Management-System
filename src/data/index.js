export const TOOLS = [
  { name: "Slack", abbr: "SL", total: 120, assigned: 98, cost: 1200, renewal: "May 12", status: "active" },
  { name: "Figma", abbr: "FG", total: 45, assigned: 34, cost: 2100, renewal: "Jun 3", status: "active" },
  { name: "AWS", abbr: "AW", total: 8, assigned: 8, cost: 3400, renewal: "Apr 30", status: "warning" },
  { name: "Notion", abbr: "NO", total: 80, assigned: 51, cost: 640, renewal: "Jul 1", status: "active" },
  { name: "Linear", abbr: "LN", total: 30, assigned: 12, cost: 360, renewal: "May 20", status: "inactive" },
  { name: "GitHub", abbr: "GH", total: 50, assigned: 44, cost: 990, renewal: "Jun 15", status: "active" },
  { name: "Zoom", abbr: "ZM", total: 60, assigned: 30, cost: 480, renewal: "Aug 1", status: "inactive" },
  { name: "Datadog", abbr: "DD", total: 15, assigned: 15, cost: 1800, renewal: "Apr 28", status: "warning" },
];

export const USERS = [
  { name: "Arjun Kumar", email: "arjun@acme.com", role: "Admin", tools: 8, lastActive: "Today", status: "active" },
  { name: "Priya Sharma", email: "priya@acme.com", role: "Employee", tools: 5, lastActive: "2d ago", status: "active" },
  { name: "Rahul Nair", email: "rahul@acme.com", role: "Employee", tools: 3, lastActive: "18d ago", status: "inactive" },
  { name: "Sneha Iyer", email: "sneha@acme.com", role: "Employee", tools: 6, lastActive: "Today", status: "active" },
  { name: "Dev Patel", email: "dev@acme.com", role: "Employee", tools: 2, lastActive: "32d ago", status: "inactive" },
  { name: "Meera Rao", email: "meera@acme.com", role: "Manager", tools: 7, lastActive: "1d ago", status: "active" },
];

export const REQUESTS = [
  { user: "Rahul Nair", tool: "Figma", reason: "UI design for Q3 revamp", date: "Apr 8", status: "pending" },
  { user: "Dev Patel", tool: "Datadog", reason: "Monitoring new microservice", date: "Apr 7", status: "pending" },
  { user: "Sneha Iyer", tool: "Linear", reason: "Project tracking access", date: "Apr 6", status: "pending" },
  { user: "Meera Rao", tool: "GitHub", reason: "Repo access for infra team", date: "Apr 5", status: "pending" },
  { user: "Priya Sharma", tool: "Notion", reason: "Docs workspace", date: "Apr 3", status: "approved" },
  { user: "Arjun Kumar", tool: "Zoom", reason: "Team calls", date: "Apr 1", status: "rejected" },
];

export const AUDIT_LOGS = [
  { action: "License revoked", actor: "Arjun Kumar", resource: "Figma → Dev Patel", time: "2 min ago", type: "danger" },
  { action: "License assigned", actor: "Arjun Kumar", resource: "Slack → Meera Rao", time: "1h ago", type: "success" },
  { action: "Request approved", actor: "Arjun Kumar", resource: "Notion → Priya Sharma", time: "3h ago", type: "success" },
  { action: "Tool added", actor: "Arjun Kumar", resource: "Datadog", time: "Yesterday", type: "info" },
  { action: "Auto-revoke triggered", actor: "System", resource: "Zoom → Rahul Nair", time: "2d ago", type: "warning" },
  { action: "Credential viewed", actor: "Priya Sharma", resource: "AWS credentials", time: "3d ago", type: "info" },
  { action: "Request rejected", actor: "Arjun Kumar", resource: "Linear → Dev Patel", time: "4d ago", type: "danger" },
];

export const CREDENTIALS = [
  { tool: "AWS", key: "Access key", value: "AKIA4EXAMPLE12345", owner: "Arjun Kumar" },
  { tool: "Figma", key: "API token", value: "figd_Abcdef1234567890", owner: "Priya Sharma" },
  { tool: "GitHub", key: "PAT", value: "ghp_Xyz9876543210abc", owner: "Arjun Kumar" },
  { tool: "Datadog", key: "API key", value: "dd_api_abcd1234efgh5678", owner: "Meera Rao" },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", group: "Overview" },
  { id: "analytics", label: "Cost analytics", group: "Overview" },
  { id: "usage", label: "Usage report", group: "Overview" },
  { id: "tools", label: "Tools", group: "Management" },
  { id: "licenses", label: "Licenses", group: "Management" },
  { id: "users", label: "Users", group: "Management" },
  { id: "requests", label: "Requests", group: "Management" },
  { id: "vault", label: "Vault", group: "Management" },
  { id: "audit", label: "Audit log", group: "Management" },
  { id: "settings", label: "Settings", group: "System" },
];
