/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCurrentUser,
  getLicenses,
  getLicensesMine,
  getMyRequests,
  getAllRequests,
  getTools,
  getUsers,
} from "../api/index.js";

const NotificationsContext = createContext(null);

function unwrap(response) {
  return Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
}

function readStorageKey(user) {
  return `licenseiq_read_notifications_${user?.userId ?? "anonymous"}`;
}

function buildNotifications({ requests, tools, users, isAdmin }) {
  const notifications = [];
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  requests.forEach((request) => {
    const status = String(request.status ?? "").toUpperCase();
    if ((isAdmin && status === "PENDING") || (!isAdmin && ["APPROVED", "REJECTED"].includes(status))) {
      notifications.push({
        id: `request-${request.id}-${status}`,
        title: isAdmin ? "Pending access request" : `Request ${status.toLowerCase()}`,
        description: `${request.toolName ?? "Tool"} access request${request.userName ? ` from ${request.userName}` : ""}.`,
        category: "Requests",
        date: request.createdAt ?? request.reviewedAt,
        href: isAdmin ? "/requests" : "/emp-requests",
      });
    }
  });

  tools.forEach((tool) => {
    const renewal = tool.renewalDate ? new Date(`${tool.renewalDate}T00:00:00`).getTime() : null;
    if (tool.status === "WARNING") {
      notifications.push({
        id: `tool-warning-${tool.id}`,
        title: "Tool requires attention",
        description: `${tool.name} is marked as needing attention.`,
        category: "Tools",
        date: tool.updatedAt,
        href: "/tools",
      });
    } else if (tool.totalSeats > 0 && tool.assignedSeats / tool.totalSeats >= 0.9) {
      notifications.push({
        id: `tool-capacity-${tool.id}-${tool.assignedSeats}`,
        title: "Tool capacity warning",
        description: `${tool.name} is at ${Math.round((tool.assignedSeats / tool.totalSeats) * 100)}% capacity.`,
        category: "Usage",
        date: tool.updatedAt,
        href: "/usage",
      });
    } else if (renewal && renewal - now <= thirtyDays) {
      notifications.push({
        id: `tool-renewal-${tool.id}-${tool.renewalDate}`,
        title: renewal < now ? "Tool renewal overdue" : "Tool renewal soon",
        description: `${tool.name} renewal date is ${tool.renewalDate}.`,
        category: "Tools",
        date: tool.renewalDate,
        href: "/tools",
      });

    }
  });

  if (isAdmin) {
    users.forEach((newUser) => {
      if (newUser.createdAt && now - new Date(newUser.createdAt).getTime() <= thirtyDays) {
        notifications.push({
          id: `user-created-${newUser.id}-${newUser.createdAt}`,
          title: "New user added",
          description: `${newUser.name} joined the organization.`,
          category: "Users",
          date: newUser.createdAt,
          href: "/users",
        });
      }
    });
  }

  return notifications.sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0));
}

export function NotificationsProvider({ children }) {
  const user = getCurrentUser();
  const userId = user?.userId;
  const isAdmin = user?.role === "ADMIN";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(readStorageKey(user)) ?? "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([
      isAdmin ? getAllRequests() : getMyRequests(),
      getTools(),
      isAdmin ? getLicenses() : getLicensesMine(userId),
      isAdmin ? getUsers() : Promise.resolve([]),
    ]);
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length === results.length) {
      throw failures[0].reason ?? new Error("Unable to load notifications.");
    }
    const [requestResponse, toolsResponse, , usersResponse] = results.map((result) =>
      result.status === "fulfilled" ? result.value : []
    );
    setNotifications(buildNotifications({
      requests: unwrap(requestResponse),
      tools: unwrap(toolsResponse),
      users: unwrap(usersResponse),
      isAdmin,
    }));
    if (failures.length) {
      setError("Some notification sources are temporarily unavailable.");
    }
    setLoading(false);
  }, [isAdmin, userId]);

  useEffect(() => {
    // Notification refresh is an external API synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((loadError) => {
      setLoading(false);
      setError(loadError.message || "Unable to load notifications.");
      console.error("Unable to load notifications", loadError);
    });
    const interval = window.setInterval(() => {
      refresh().catch((refreshError) => {
        setLoading(false);
        setError(refreshError.message || "Unable to refresh notifications.");
        console.error("Unable to refresh notifications", refreshError);
      });
    }, 30000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const markRead = (id) => {
    setReadIds((current) => {
      const next = current.includes(id) ? current : [...current, id];
      localStorage.setItem(readStorageKey(user), JSON.stringify(next));
      return next;
    });
  };

  const markAllRead = () => {
    const ids = notifications.map((notification) => notification.id);
    localStorage.setItem(readStorageKey(user), JSON.stringify(ids));
    setReadIds(ids);
  };

  const value = {
    notifications,
    loading,
    error,
    readIds,
    unreadCount: notifications.filter((notification) => !readIds.includes(notification.id)).length,
    unreadCountFor: (category) => notifications.filter((notification) => notification.category === category && !readIds.includes(notification.id)).length,
    markRead,
    markAllRead,
    refresh,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used within NotificationsProvider");
  return context;
}
