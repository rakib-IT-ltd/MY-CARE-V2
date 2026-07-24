import React, { useState, useEffect } from "react";
import {
  collection, doc, setDoc, updateDoc, query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import {
  Utensils, ChevronDown, Info, SquarePen, ChevronRight, Banknote, Users, Bell, CheckCircle2,
} from "lucide-react";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import { getInitialsFrom, todayKey } from "../../../utils/helpers";
import { MEAL_TYPES } from "../../../constants/meals";
import PendingRequestCard from "../../../components/PendingRequestCard";
import SectionTitle from "../../../components/SectionTitle";
import {
  studentTopStats, studentMeals, studentMenu, studentNotices,
} from "../../../constants/hostelData";

export default function StudentDashboard({ currentUser, hostelId, hostelInfo, onAccepted }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null); // { breakfast: [...], lunch: [...], dinner: [...] }
  const [myChoices, setMyChoices] = useState({});
  const [savingChoice, setSavingChoice] = useState(false);
  const [choiceSavedNote, setChoiceSavedNote] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "connectionRequests"),
      where("toUid", "==", currentUser.uid),
      where("type", "==", "hostel_student"),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPendingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!hostelId) { setTodayMenu(null); return; }
    const unsub = onSnapshot(doc(db, "hostels", hostelId, "days", todayKey()), (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setTodayMenu(data.menu || null);
      const mine = data.choices?.[currentUser?.uid];
      if (mine) setMyChoices(mine);
    });
    return () => unsub();
  }, [hostelId, currentUser]);

  const pickChoice = (mealKey, itemKey) => {
    setMyChoices(prev => ({ ...prev, [mealKey]: itemKey }));
  };

  const handleSaveChoices = async () => {
    setSavingChoice(true);
    try {
      await setDoc(doc(db, "hostels", hostelId, "days", todayKey()), {
        choices: { [currentUser.uid]: { name: currentUser.name, ...myChoices } },
      }, { merge: true });
      setChoiceSavedNote("Your meal choices are saved!");
      setTimeout(() => setChoiceSavedNote(""), 3000);
    } finally {
      setSavingChoice(false);
    }
  };

  const handleAccept = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "accepted" });
    await setDoc(doc(db, "hostels", req.hostelId, "students", currentUser.uid), {
      uid: currentUser.uid, name: currentUser.name, careId: currentUser.careId,
      room: "", status: "active", rentStatus: "due",
      joinedAt: serverTimestamp(),
    });
    await setDoc(doc(db, "users", currentUser.uid), {
      hostel: { role: "student", hostelId: req.hostelId },
    }, { merge: true });
    onAccepted(req.hostelId);
  };

  const handleDecline = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "declined" });
  };

  return (
    <div>
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionTitle>Connection Requests</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingRequests.map(r => (
              <PendingRequestCard
                key={r.id} name={r.fromName} sub="Wants to add you as a student"
                initials={getInitialsFrom(r.fromName)} bg="#E4F3EA" fg={GREEN}
                onAccept={() => handleAccept(r)} onDecline={() => handleDecline(r)}
              />
            ))}
          </div>
        </div>
      )}

      {hostelId && hostelInfo && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} style={{ flexShrink: 0 }} />
          You're a student at <b>&nbsp;{hostelInfo.name}</b>
        </div>
      )}

      {!hostelId && pendingRequests.length === 0 && (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          marginBottom: 16, fontSize: 12.5, color: "#6b6d66", lineHeight: 1.6
        }}>
          You're not part of a hostel yet. Share your CARE ID with your hostel manager so they can add you.
        </div>
      )}

      {/* Top stats — illustrative demo content until room/rent/meal tracking is built */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {studentTopStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: "10px 8px" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6
              }}>
                <Icon size={12} color={s.fg} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#8B8D86" }}>{s.label}</div>
              <div style={{ fontSize: 8.5, color: "#8B8D86" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Menu — pick your meal for each type */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Utensils size={16} /> Today's Menu
        </span>
      </div>

      {!hostelId ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          fontSize: 12.5, color: "#6b6d66"
        }}>
          Join a hostel first to see today's menu.
        </div>
      ) : !todayMenu ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          fontSize: 12.5, color: "#6b6d66"
        }}>
          Your hostel manager hasn't set today's menu yet.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 12 }}>
            Rice & Dal are included with every meal. Pick your main item below.
          </div>
          {MEAL_TYPES.map((mt, i) => {
            const options = todayMenu[mt.key] || [];
            return (
              <div key={mt.key} style={{ marginTop: i > 0 ? 16 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <mt.icon size={14} color={mt.fg} /> {mt.label}
                </div>
                {options.length === 0 ? (
                  <div style={{ fontSize: 11.5, color: "#c7c8c2" }}>No options set for this meal today.</div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {options.map(item => {
                      const selected = myChoices[mt.key] === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => pickChoice(mt.key, item.key)}
                          style={{
                            border: selected ? "none" : "1px solid #ECEDE8",
                            background: selected ? mt.fg : "#fff",
                            color: selected ? "#fff" : "#1A1A1A",
                            borderRadius: 999, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={handleSaveChoices} disabled={savingChoice} style={{
            width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
            padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 16, opacity: savingChoice ? 0.7 : 1
          }}>
            <CheckCircle2 size={15} /> {savingChoice ? "Saving..." : "Save My Meal Choices"}
          </button>
          {choiceSavedNote && (
            <div style={{ fontSize: 11.5, color: GREEN, marginTop: 8, textAlign: "center" }}>{choiceSavedNote}</div>
          )}
        </div>
      )}

      <div style={{
        background: "#E4F3EA", borderRadius: 12, padding: 12, marginTop: 12,
        display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#1A1A1A"
      }}>
        <Info size={15} color={GREEN} /> Please be on time for your meals. Thank you!
      </div>

      {/* My Rent / My Guests */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <div style={{ flex: 1, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Banknote size={14} /> My Rent
            </span>
            <span style={{ background: "#E4F3EA", color: GREEN, fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>Paid</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>৳ 4,000</div>
          <div style={{ fontSize: 11, color: "#8B8D86" }}>Due: 5 Jul 2025</div>
        </div>
        <div style={{ flex: 1, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={14} /> My Guests
            </span>
            <span style={{ background: "#E5EFFC", color: "#2F6FE0", fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>This month</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>1 / 2</div>
          <div style={{ fontSize: 11, color: "#8B8D86" }}>Used / Allowed</div>
        </div>
      </div>

      {/* Notices */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Bell size={15} /> Notices
        </span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View all</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {studentNotices.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.key} style={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Icon size={15} color={n.fg} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{n.title}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>{n.meta}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

