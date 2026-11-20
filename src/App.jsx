import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { logout as apiLogout, getCurrentUser } from "./api/index.js";

import LoginPage from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import EmployeeSidebar from "./components/EmployeeSidebar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import UsageReport from "./pages/UsageReport.jsx";
import ToolsPage from "./pages/Tools.jsx";
import Licenses from "./pages/Licenses.jsx";
import Users from "./pages/Users.jsx";
import Requests from "./pages/Requests.jsx";
import Vault from "./pages/Vault.jsx";
import AuditLog from "./pages/AuditLog.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

import EmployeeHome from "./pages/employee/EmployeeHome.jsx";
import EmployeeRequestAccess from "./pages/employee/EmployeeRequestAccess.jsx";
import EmployeeMyRequests from "./pages/employee/EmployeeMyRequests.jsx";
import RegisterOrg from "./RegisterOrg.jsx";
import AcceptInvitation from "./Pages/AcceptInvitation.jsx";
import { ForgotPassword, ResetPassword } from "./Pages/ResetPassword.jsx";
import { NotificationsProvider } from "./components/NotificationsContext.jsx";

function AppShell({ sidebar, topbar, children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flexShrink: 0 }}>{sidebar}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {topbar}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(() => {
    const storedUser = localStorage.getItem("licenseiq_user");
    try {
      return storedUser ? JSON.parse(storedUser).role : null;
    } catch {
      apiLogout();
      return null;
    }
  });
  const [authChecking, setAuthChecking] = useState(() => Boolean(localStorage.getItem("licenseiq_token")));
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("licenseiq_token");

    if (!storedToken) {
      return;
    }

    fetch(`${import.meta.env.VITE_Backend_URL}/api/auth/isValid`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        const valid = res.ok && (await res.json()) === true;
        if (!valid) {
          apiLogout();
          setRole(null);
        }
      })
      .catch(() => {
        apiLogout();
        setRole(null);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  // Account activation and recovery links remain usable even if another user is signed in locally.
  if (["/accept-invite", "/forgot-password", "/reset-password"].includes(location.pathname)) {
    return <Routes>
      <Route path="/accept-invite" element={<AcceptInvitation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>;
  }

  if (authChecking) {
    return <Loading />;
  }

  if (!role) return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={(r) => setRole(r)} />} />
      <Route path="/login" element={<LoginPage onLogin={(r) => setRole(r)} />} />
      <Route path="/accept-invite" element={<AcceptInvitation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/register-org" element={<RegisterOrg />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
    ;

  return (
    <NotificationsProvider>
    <>
          {role === "ADMIN" ? (
        <AppShell sidebar={<Sidebar />} topbar={<Topbar active={location.pathname === "/settings" ? "settings" : location.pathname === "/profile" ? "profile" : "dashboard"} />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/usage" element={<UsageReport />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AppShell>
      ) : (
        <AppShell
          sidebar={<EmployeeSidebar user={getCurrentUser()} />}
          topbar={
            <Topbar active={location.pathname === "/settings" ? "settings" : location.pathname === "/profile" ? "profile" : "dashboard"} />
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/emp-home" />} />
            <Route path="/emp-home" element={<EmployeeHome />} />
            <Route path="/emp-request" element={<EmployeeRequestAccess />} />
            <Route path="/emp-requests" element={<EmployeeMyRequests />} />
            <Route path="/requests" element={<Navigate to="/emp-requests" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/emp-profile" element={<Navigate to="/profile" replace />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      )}
      </>
    </NotificationsProvider>

  );
}

function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#888" }}>
      Checking your session…
    </div>
  );
}
