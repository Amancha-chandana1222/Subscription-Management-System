import { useState, useEffect } from "react";
import { deleteRequest, getAllRequests, updateRequest } from "../api/index.js";
import { StatCard, SectionCard, Btn } from "../Components/index.jsx";
import { StatusBadge } from "../Components/index.jsx";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllRequests()
      .then((response) => {
        const records = Array.isArray(response?.data) ? response.data : [];
        if (!Array.isArray(response?.data)) {
          throw new Error("The requests response was not in the expected format.");
        }
        setRequests(records);
      })
      .catch((requestError) => {
        console.error("Unable to load requests", requestError);
        setError(requestError.message || "Unable to load requests.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handle = async (id, action) => {
    try {
      const updated = await updateRequest(id, action);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e) {
      alert("Action failed: " + e.message);
    }
  };
const handleReject = async (id) => {
    try {
      await deleteRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      alert("Action failed: " + e.message);
    }
  };
  


  const pending  = requests?.filter(r => r.status === "PENDING").length;
  const approved = requests?.filter(r => r.status === "APPROVED").length;
  const rejected = requests?.filter(r => r.status === "REJECTED").length;

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Pending"  value={pending}  dark />
        <StatCard label="Approved" value={approved} />
        <StatCard label="Rejected" value={rejected} />
      </div>

      <SectionCard title="All requests" noPadding>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 80px 2fr 90px 150px",
          fontSize: 11, fontWeight: 600, color: "#a0a0a0",
          letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span>Requester</span><span>Tool</span><span>Reason</span><span>Status</span><span>Actions</span>
        </div>

        {loading && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            Loading requests…
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#b91c1c", background: "#fef2f2", fontSize: 13 }}>
            {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#a0a0a0", fontSize: 13 }}>
            No requests found.
          </div>
        )}

        {!error && requests.map((r) => (
          <div key={r.id} style={{
            display: "grid", gridTemplateColumns: "1fr 80px 2fr 90px 150px",
            padding: "14px 20px", borderBottom: "1px solid #f9f9f9",
            alignItems: "center", fontSize: 13,
          }}>
            <span style={{ fontWeight: 600 }}>{r.userName}</span>
            <span style={{ color: "#525252" }}>{r.toolName}</span>
            <span style={{ color: "#a0a0a0", fontSize: 12 }}>{r.reason}</span>
            <StatusBadge status={r.status} />

            {r.status === "PENDING" ? (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="primary"  small onClick={() => handle(r.id, "approved")}>Approve</Btn>
                <Btn variant="danger"   small onClick={() => handleReject(r.id)}>Reject</Btn>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "#b0b0b0" }}>{formatDate(r.createdAt)}</span>
            )}
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
