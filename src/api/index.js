import { get, post, put, del } from "./client.js";

// ── Auth ─────────────────────────────────────────────────────
export async function login(email, password) {
  const res = await post("/auth/login", { email, password });
  const data = res.data ?? res;
  localStorage.setItem("licenseiq_token", data.accessToken);
  localStorage.setItem("licenseiq_user", JSON.stringify({
    name: data.name,
    email: data.email,
    role: data.role,
    userId: data.userId,
    department: data.department ?? null,
    organizationId: data.organizationId ?? null,
    organizationName: data.organizationName ?? null,
  }));
  return data;
}

export function logout() {
  localStorage.removeItem("licenseiq_token");
  localStorage.removeItem("licenseiq_user");
}

export function getCurrentUser() {
  const u = localStorage.getItem("licenseiq_user");
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    logout();
    return null;
  }
}

export function updateCurrentUser(user) {
  localStorage.setItem("licenseiq_user", JSON.stringify(user));
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
export const resendInvitation = (id) => post(`/users/${id}/resend-invitation`);
export const getMyProfile = () => get("/users/me");
export const updateMyProfile = (data) => put("/users/me", data);
export const getMyNotificationPreferences = () => get("/users/me/notification-preferences");
export const updateMyNotificationPreferences = (data) => put("/users/me/notification-preferences", data);
export const changeMyPassword = (data) => put("/users/me/password", data);
export const validateInvitation = (token) => get(`/auth/invitations/validate?token=${encodeURIComponent(token)}`);
export const acceptInvitation = (payload) => post("/auth/invitations/accept", payload);
export const forgotPassword = (email) => post("/auth/forgot-password", { email });
export const resetPassword = (payload) => post("/auth/reset-password", payload);

// ── Access Requests ──────────────────────────────────────────
export const getAllRequests   = ()           => get("/requests");
export const getMyRequests    = ()           => get("/requests/mine");
export const submitRequest    = (dto)        => post("/requests", dto);
export const updateRequest    = (id, status) => put(`/requests/${id}/approve`, { status });
export const deleteRequest    = (id)           => put(`/requests/${id}/reject`);
// ── Audit Logs ───────────────────────────────────────────────
export const getAuditLogs = () => get("/audit-logs");
export const getAuditLogsForExport = () => get("/audit-logs/export", "blob");

// Organization — public register creates org + first ADMIN
export const getOrganization = () => get("/orgs/current");
export const updateOrganization = (form) => put("/orgs/current", form);
export const createOrganization = (form) => post("/auth/register", form);

// ── Vault ────────────────────────────────────────────────────
export const getVault         = ()    => get("/credentials");
export const revealCredential = (id)  => get(`/credentials/${id}/reveal`);
export const createCredential = (data) => post("/credentials", data);
