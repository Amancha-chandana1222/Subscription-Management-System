import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { logout as apiLogout } from "./api/index.js";

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

import EmployeeHome from "./pages/employee/EmployeeHome.jsx";
import EmployeeRequestAccess from "./pages/employee/EmployeeRequestAccess.jsx";
import EmployeeMyRequests from "./pages/employee/EmployeeMyRequests.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";
import Home from "./Pages/Home.jsx";
import RegisterOrg from "./Registerorg.jsx";

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
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("licenseiq_user");
    const storedToken = localStorage.getItem("licenseiq_token");

    if (storedToken) {
      fetch(`${import.meta.env.VITE_Backend_URL}/api/auth/isValid`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            apiLogout();
            setRole(null);
          }
        })
        .catch(() => {
          apiLogout();
          setRole(null);
        });
    }

    if (storedUser) {
      const { role } = JSON.parse(storedUser);
      setRole(role);
    }
  }, []);

  // if (!role) return <LoginPage onLogin={(r) => setRole(r)} />;
  if (!role) return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage onLogin={(r) => setRole(r)} />} />
      
      <Route path="/register-org" element={<RegisterOrg />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
    ;

  return (
    <>
          {role === "ADMIN" ? (
        <AppShell sidebar={<Sidebar />} topbar={<Topbar />}>
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
            
          </Routes>
        </AppShell>
      ) : (
        <AppShell sidebar={<EmployeeSidebar />} topbar={<div>Employee</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/emp-home" />} />
            <Route path="/emp-home" element={<EmployeeHome />} />
            <Route path="/emp-request" element={<EmployeeRequestAccess />} />
            <Route path="/emp-requests" element={<EmployeeMyRequests />} />
            <Route path="/emp-profile" element={<EmployeeProfile />} />
          </Routes>
        </AppShell>
      )}
      </>

  );
}