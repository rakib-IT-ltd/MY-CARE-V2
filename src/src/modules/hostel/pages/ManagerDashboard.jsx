import React, { useState, useEffect } from "react";
import {
  collection, doc, getDocs, addDoc, query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import {
  Plus, Utensils, SquarePen, CheckCircle2, ChevronRight, Clock,
} from "lucide-react";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import { getInitialsFrom } from "../../../utils/helpers";
import ConnectByCareId from "../../../components/ConnectByCareId";
import SectionTitle from "../../../components/SectionTitle";
import {
  managerStats, recentActivities, menuToday,
} from "../../../constants/hostelData";

export default function ManagerDashboard({ currentUser, hostelId, hostelInfo, students }) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [sentInvites, setSentInvites] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "connectionRequests"),
      where("fromUid", "==", currentUser.uid),
      where("type", "==", "hostel_student"),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSentInvites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const handleFindStudent = async (careId) => {
    const q = query(collection(db, "users"), where("careId", "==", careId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    if (docSnap.id === currentUser.uid) throw new Error("That's your own CARE ID.");
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      name: data.name,
      phone: "Not shared yet",
      initials: getInitialsFrom(data.name),
      bg: "#E5EFFC", fg: "#2F6FE0",
    };
  };

  const handleSendInvite = async (profile) => {
    await addDoc(collection(db, "connectionRequests"), {
      type: "hostel_student",
      fromUid: currentUser.uid,
      fromName: currentUser.name,
      toUid: profile.uid,
      hostelId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div>
      {/* Quick entry banner */}
      <div style={{ background: GREEN_DARK, borderRadius: 16, padding: 16, color: "#fff", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{hostelInfo?.name || "Your Hostel"}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>Managed by {currentUser?.name}</div>
          </div>
          <button onClick={() => setQuickEntryOpen(o => !o)} style={{
            background: "#fff", color: GREEN_DARK, border: "none", borderRadius: 999, padding: "8px 14px",
            fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            <Plus size={14} /> Quick Entry
          </button>
        </div>

        {quickEntryOpen && (
          <div style={{ marginTop: 14, background: "#fff", borderRadius: 12, padding: 4 }}>
            <ConnectByCareId
              label="Add a student by their CARE ID"
              onFind={handleFindStudent}
              onSent={handleSendInvite}
            />
          </div>
        )}
      </div>

      {sentInvites.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionTitle>Pending Invitations</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sentInvites.map(r => (
              <div key={r.id} style={{
                background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12,
                display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#6b6d66"
              }}>
                <Clock size={15} color="#E08A20" style={{ flexShrink: 0 }} />
                Waiting for a student to accept your invite.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Students (real) */}
      <SectionTitle>My Students ({students.length})</SectionTitle>
      {students.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          marginBottom: 16, fontSize: 12.5, color: "#6b6d66"
        }}>
          No students yet — use Quick Entry above to add one by their CARE ID.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {students.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < students.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: GREEN, fontSize: 12.5, flexShrink: 0
              }}>{getInitialsFrom(s.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.careId}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats grid — illustrative demo numbers except Students, which is real */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {managerStats.map(s => {
          const Icon = s.icon;
          const value = s.key === "students" ? students.length : s.value;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
              }}>
                <Icon size={16} color={s.fg} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Activities</span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View all</span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {recentActivities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < recentActivities.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: a.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon size={15} color={a.fg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{a.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

