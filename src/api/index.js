import { get, post, put, patch, del } from "./client.js";

// ── Auth ─────────────────────────────────────────────────────
export async function login(email, password) {
  const data = await post("/auth/login", { email, password });
  // Store token for subsequent requests
  localStorage.setItem("licenseiq_token", data.token);
  localStorage.setItem("licenseiq_user",  JSON.stringify({ name: data.name, email: data.email, role: data.role }));
  return data;
}

export function logout() {
  localStorage.removeItem("licenseiq_token");
  localStorage.removeItem("licenseiq_user");
}

export function getCurrentUser() {
  const u = localStorage.getItem("licenseiq_user");
  return u ? JSON.parse(u) : null;
}

// ── Dashboard ────────────────────────────────────────────────
export const getDashboardStats = () => get("/dashboard/stats");

// ── Tools ────────────────────────────────────────────────────
export const getTools      = (search) => get(search ? `/tools?search=${encodeURIComponent(search)}` : "/tools");
export const createTool    = (tool)   => post("/tools", tool);
export const updateTool    = (id, t)  => put(`/tools/${id}`, t);
export const deleteTool    = (id)     => del(`/tools/${id}`);

// ── Licenses ─────────────────────────────────────────────────
export const getLicenses     = ()    => get("/licenses");
export const getLicensesMine = (id)  => get(`/licenses/user/${id}`);
export const assignLicense   = (userId, toolId)   => post("/licenses/assign", { userId, toolId });
export const revokeLicense   = (id)  => del(`/licenses/${id}/revoke`);

// ── Users ────────────────────────────────────────────────────
export const getUsers      = ()    => get("/users");
export const inviteUser    = (u)   => post("/users/invite", u);

// ── Access Requests ──────────────────────────────────────────
export const getAllRequests   = ()           => get("/requests");
export const getMyRequests    = ()           => get("/requests/mine");
export const submitRequest    = (dto)        => post("/requests", dto);
export const updateRequest    = (id, status) => put(`/requests/${id}/approve`, { status });
export const deleteRequest    = (id)           => put(`/requests/${id}/reject`);
// ── Audit Logs ───────────────────────────────────────────────
export const getAuditLogs = () => get("/audit-logs");

//Organization 
export const getOrganization = () => get("/orgs");
export const createOrganization = (form) => post("/orgs/register", form);




// ── Vault ────────────────────────────────────────────────────
export const getVault         = ()    => get("/credentials");
export const revealCredential = (id)  => get(`/credentials/${id}/reveal`);
export const createCredential = (data) => post("/credentials", data);
