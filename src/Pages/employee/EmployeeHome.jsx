import { useState, useEffect } from "react";
import { getLicensesMine, getMyRequests, getCurrentUser } from "../../api/index.js";
import { StatusBadge } from "../../components/index.jsx";

export default function EmployeeHome({ setActive }) {
  const [myTools, setMyTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();
  const displayName = user?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    if (!user?.userId) return;

    Promise.all([
      getLicensesMine(user.userId),
      getMyRequests()
    ])
      .then(([lic, req]) => {
        setMyTools((lic.data || []).filter(l => l.status === "ACTIVE"));
        setRequests(req.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const pending = requests.filter(r => r.status === "PENDING").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* 🔥 Welcome */}
      <div style={{
        background: "#0a0a0a",
        borderRadius: 12,
        padding: "24px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            Hey {displayName} 👋
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            {loading
              ? "Loading..."
              : `You have ${myTools.length} active tools`}
          </div>
        </div>

        <button
          onClick={() => setActive("emp-request")}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          + Request
        </button>
      </div>

      {/* 🔥 Tools */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>My Tools</div>

        {loading ? (
          <div>Loading tools...</div>
        ) : myTools.length === 0 ? (
          <div style={{ color: "#888" }}>No tools assigned</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
            gap: 12
          }}>
            {myTools.map((l) => (
              <div key={l.id} style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}>

                {/* Top */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700
                  }}>
                    {l.toolAbbr || "?"}
                  </div>

                  <StatusBadge status={l.status} />
                </div>

                {/* Name */}
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {l.toolName || "Unknown Tool"}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Status: {l.status}
                  </div>
                </div>

                {/* Bottom */}
                <div style={{
                  borderTop: "1px solid #f2f2f2",
                  paddingTop: 8,
                  fontSize: 12,
                  color: "#666"
                }}>
                  Renews: {l.renewalDate || "N/A"}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 12
      }}>
        {[
          { label: "Tools", value: myTools.length },
          { label: "Requests", value: requests.length },
          { label: "Pending", value: pending }
        ].map((s) => (
          <div key={s.label} style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            background: "#fff"
          }}>
            <div style={{ fontSize: 12, color: "#888" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}