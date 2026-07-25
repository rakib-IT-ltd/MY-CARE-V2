import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc,
  query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import {
  Backpack, Bell, Calendar, CheckCircle2, ChevronDown, MapPin, Menu, Pencil, Plus,
  Radio, Sun, UserPlus, Users, Wallet, Waves, Bus, List, Receipt,
  CheckSquare, MoreHorizontal, Sunrise, DoorOpen, Square, Utensils,
  MessageCircle, Settings, LogOut, Share2, Clock, Phone, Building2,
} from "lucide-react";
import { useCurrentUser } from "../../../contexts/CurrentUserContext";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import { getInitialsFrom } from "../../../utils/helpers";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";
import ConnectByCareId from "../../../components/ConnectByCareId";
import PendingRequestCard from "../../../components/PendingRequestCard";
import SectionTitle from "../../../components/SectionTitle";

const tripTabs = [
  { key: "itinerary", name: "Itinerary", icon: List },
  { key: "expenses", name: "Expenses", icon: Receipt },
  { key: "members", name: "Members", icon: Users },
  { key: "checklists", name: "Checklists", icon: CheckSquare },
  { key: "bookings", name: "Bookings", icon: Backpack },
  { key: "more", name: "More", icon: MoreHorizontal },
];

const EXPENSE_CATEGORIES = ["Food", "Transport", "Hotel", "Shopping", "Emergency", "Medicine", "Entertainment", "Misc"];

const todayItinerary = [
  { key: "wake", time: "05:30 AM", title: "Wake Up", sub: "Get ready for an amazing trip", icon: Sunrise, fg: "#6E4FD1", done: true },
  { key: "leave", time: "06:30 AM", title: "Leave Home", sub: "Start your journey", icon: DoorOpen, fg: "#1F8A5A", done: true },
  { key: "bus", time: "08:00 AM", title: "Bus Departs", sub: "Green Line, Dhaka to Cox's Bazar", icon: Bus, fg: "#2F6FE0", done: true },
  { key: "reach", time: "02:00 PM", title: "Reach Cox's Bazar", sub: "Check-in at hotel", icon: MapPin, fg: "#E0435A", done: true },
  { key: "lunch2", time: "03:30 PM", title: "Lunch", sub: "Poushee Restaurant", icon: Utensils, fg: "#E08A20", done: true },
];

const placesToVisit = [
  { key: "laboni", name: "Laboni Beach", bg: "linear-gradient(135deg,#8FD3E8,#F5D69B)" },
  { key: "marine", name: "Marine Drive", bg: "linear-gradient(135deg,#A7C5EB,#7FA6C9)" },
  { key: "himchari", name: "Himchari", bg: "linear-gradient(135deg,#9FCB8F,#5E9BB0)" },
];

const tripChat = [
  { key: "karim", name: "Karim", initials: "K", msg: "We will reach hotel in 30 mins.", time: "02:15 PM", badge: 2 },
  { key: "rahim", name: "Rahim", initials: "R", msg: "Lunch at 1:30 PM. Everyone be ready.", time: "01:45 PM" },
];

const initialChecklist = [
  { key: "tent", label: "Tent / Beach Mat", packed: true },
  { key: "sunscreen", label: "Sunscreen", packed: true },
  { key: "camera", label: "Camera", packed: true },
  { key: "swimwear", label: "Swimwear", packed: true },
  { key: "medicines", label: "Medicines", packed: true },
  { key: "idcard", label: "ID Card / NID", packed: true },
  { key: "cash", label: "Cash & Cards", packed: false },
  { key: "charger", label: "Phone Charger", packed: false },
  { key: "towel", label: "Towel", packed: false },
  { key: "firstaid", label: "First Aid Kit", packed: false },
];

const bookings = [
  {
    key: "hotel", type: "Hotel", icon: Building2, fg: "#6E4FD1", bg: "#EFEAFB",
    name: "Sea View Hotel", detail: "Deluxe Double Room - 2 Rooms",
    checkin: "18 Dec, 2:30 PM", checkout: "21 Dec, 12:00 PM", ref: "BK-88213",
  },
  {
    key: "bus", type: "Transport", icon: Bus, fg: "#E08A20", bg: "#FDF0DF",
    name: "Green Line Paribahan", detail: "Dhaka to Cox's Bazar - Seats 12-13",
    checkin: "18 Dec, 08:00 AM Departure", checkout: "Non-AC Business Class", ref: "BK-55021",
  },
];

function CreateTripForm({ onCreate, creating }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !destination.trim()) return;
    onCreate({ name: name.trim(), destination: destination.trim(), startDate, endDate, budget: Number(budget) || 0 });
  };

  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "#E3F4F8", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Waves size={28} color="#1CA6C2" />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 19, color: "#1A1A1A" }}>Plan a trip</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6b6d66" }}>Set up your trip and invite travelers by CARE ID.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Trip name (e.g. Cox's Bazar Trip)"
          style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 13.5 }} />
        <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination"
          style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 13.5 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 13.5 }} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 13.5 }} />
        </div>
        <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget (Tk)"
          style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 13.5 }} />
        <button onClick={handleSubmit} disabled={creating} style={{
          background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0",
          fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: creating ? 0.7 : 1
        }}>
          {creating ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </div>
  );
}

export default function TravelPage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [loadingTrip, setLoadingTrip] = useState(true);
  const [tripId, setTripId] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const [creatingTrip, setCreatingTrip] = useState(false);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [activeTripTab, setActiveTripTab] = useState("itinerary");
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [incomingTripRequests, setIncomingTripRequests] = useState([]);
  const [tripConnectedNote, setTripConnectedNote] = useState("");

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [savingExpense, setSavingExpense] = useState(false);

  const [checklist, setChecklist] = useState(initialChecklist);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (data.trip?.tripId) setTripId(data.trip.tripId);
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
      setLoadingTrip(false);
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!tripId) { setTripInfo(null); return; }
    const unsub = onSnapshot(doc(db, "trips", tripId), (snap) => {
      if (snap.exists()) setTripInfo(snap.data());
    });
    return () => unsub();
  }, [tripId]);

  useEffect(() => {
    if (!tripId) { setMembers([]); return; }
    const unsub = onSnapshot(collection(db, "trips", tripId, "members"), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [tripId]);

  useEffect(() => {
    if (!tripId) { setExpenses([]); return; }
    const unsub = onSnapshot(collection(db, "trips", tripId, "expenses"), (snap) => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [tripId]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "connectionRequests"),
      where("toUid", "==", currentUser.uid),
      where("type", "==", "trip_member"),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setIncomingTripRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const handleCreateTrip = async ({ name, destination, startDate, endDate, budget }) => {
    setCreatingTrip(true);
    try {
      const tripRef = await addDoc(collection(db, "trips"), {
        name, destination, startDate, endDate, budget,
        organizerUid: currentUser.uid, organizerName: currentUser.name,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "trips", tripRef.id, "members", currentUser.uid), {
        uid: currentUser.uid, name: currentUser.name, careId: currentUser.careId,
        role: "organizer", joinedAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", currentUser.uid), {
        trip: { tripId: tripRef.id },
      }, { merge: true });
      setTripId(tripRef.id);
    } finally {
      setCreatingTrip(false);
    }
  };

  const handleFindTraveler = async (careId) => {
    const q = query(collection(db, "users"), where("careId", "==", careId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    if (docSnap.id === currentUser.uid) throw new Error("That's your own CARE ID.");
    const data = docSnap.data();
    return {
      uid: docSnap.id, name: data.name, phone: "Not shared yet",
      initials: getInitialsFrom(data.name), bg: "#E5EFFC", fg: "#2F6FE0",
    };
  };

  const handleSendTripInvite = async (profile) => {
    await addDoc(collection(db, "connectionRequests"), {
      type: "trip_member", fromUid: currentUser.uid, fromName: currentUser.name,
      toUid: profile.uid, tripId, status: "pending", createdAt: serverTimestamp(),
    });
  };

  const handleTripAccept = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "accepted" });
    await setDoc(doc(db, "trips", req.tripId, "members", currentUser.uid), {
      uid: currentUser.uid, name: currentUser.name, careId: currentUser.careId,
      role: "member", joinedAt: serverTimestamp(),
    });
    await setDoc(doc(db, "users", currentUser.uid), { trip: { tripId: req.tripId } }, { merge: true });
    setTripId(req.tripId);
    setTripConnectedNote("You've joined the trip!");
  };
  const handleTripDecline = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "declined" });
  };

  const handleAddExpense = async () => {
    const amount = Number(newExpenseAmount);
    if (!newExpenseDesc.trim() || !amount || members.length === 0) return;
    setSavingExpense(true);
    try {
      await addDoc(collection(db, "trips", tripId, "expenses"), {
        description: newExpenseDesc.trim(),
        amount,
        category: newExpenseCategory,
        paidByUid: currentUser.uid,
        paidByName: currentUser.name,
        splitAmong: members.map(m => m.uid),
        createdAt: serverTimestamp(),
      });
      setNewExpenseDesc("");
      setNewExpenseAmount("");
      setShowAddExpense(false);
    } finally {
      setSavingExpense(false);
    }
  };

  const toggleChecklistItem = (key) => {
    setChecklist(prev => prev.map(i => i.key === key ? { ...i, packed: !i.packed } : i));
  };
  const addChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    setChecklist(prev => [...prev, { key: `item-${Date.now()}`, label: text, packed: false }]);
    setNewChecklistItem("");
  };
  const packedCount = checklist.filter(i => i.packed).length;
  const checklistPct = checklist.length ? Math.round((packedCount / checklist.length) * 100) : 0;

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const budget = tripInfo?.budget || 0;
  const remaining = budget - totalSpent;
  const spentPct = budget ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  const memberBalances = members.map(m => {
    const paid = expenses.filter(e => e.paidByUid === m.uid).reduce((s, e) => s + (e.amount || 0), 0);
    const fairShare = expenses.reduce((s, e) => {
      const splitCount = e.splitAmong?.length || 1;
      return (e.splitAmong || []).includes(m.uid) ? s + (e.amount || 0) / splitCount : s;
    }, 0);
    const balance = paid - fairShare;
    return {
      ...m,
      balance,
      positive: balance >= 0,
      amountLabel: `Tk ${Math.abs(Math.round(balance)).toLocaleString()}`,
      statusLabel: balance >= 0 ? "Will receive" : "Owes",
    };
  });

  const daysLeft = (() => {
    if (!tripInfo?.startDate) return "-";
    const diff = Math.ceil((new Date(tripInfo.startDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  if (loadingTrip) {
    return <div style={{ padding: "60px 20px", textAlign: "center", color: "#8B8D86", fontSize: 13 }}>Loading...</div>;
  }

  if (!tripId) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 0" }}>
          <button onClick={() => navigate(-1)} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <ChevronDown size={16} color="#1A1A1A" style={{ transform: "rotate(90deg)" }} />
          </button>
        </div>
        {incomingTripRequests.length > 0 && (
          <div style={{ padding: "0 20px", marginBottom: 8 }}>
            <SectionTitle>Trip Invitations</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {incomingTripRequests.map(r => (
                <PendingRequestCard
                  key={r.id} name={r.fromName} sub="Invited you to a trip"
                  initials={getInitialsFrom(r.fromName)} bg="#E5EFFC" fg="#2F6FE0"
                  onAccept={() => handleTripAccept(r)} onDecline={() => handleTripDecline(r)}
                />
              ))}
            </div>
          </div>
        )}
        <CreateTripForm onCreate={handleCreateTrip} creating={creatingTrip} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Travel</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Plan together. Travel better.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>{currentUser?.initials || "NA"}</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>

        <div style={{
          borderRadius: 18, overflow: "hidden", position: "relative", margin: "10px 0",
          background: "linear-gradient(160deg,#BFE3F0 0%,#DCEAC9 55%,#E8D9A6 100%)",
          padding: "18px 18px 70px"
        }}>
          <Sun size={38} color="#F2A93B" style={{ position: "absolute", top: 14, right: 18, opacity: 0.9 }} />
          <Waves size={160} color="#ffffff" style={{ position: "absolute", bottom: -10, right: -20, opacity: 0.35 }} />
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", position: "relative" }}>
            {tripInfo?.name || "Your Trip"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <MapPin size={14} /> {tripInfo?.destination || "-"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Calendar size={14} /> {tripInfo?.startDate || "?"} to {tripInfo?.endDate || "?"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Users size={14} /> {members.length} Travelers
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Wallet size={14} /> Budget: Tk {budget.toLocaleString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, position: "relative" }}>
            <button style={{
              background: GREEN, color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
            }}>
              <Radio size={14} /> Live Trip
            </button>
            <button style={{
              background: "#fff", color: "#1A1A1A", border: "1px solid #e2e3dd", borderRadius: 10, padding: "9px 14px",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
            }}>
              <Pencil size={13} /> Edit Trip
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginTop: -50, position: "relative" }}>
          {[
            { key: "days", icon: Calendar, bg: "#E4F3EA", fg: "#1F8A5A", value: String(daysLeft), label: "Days Left", sub: "Until trip" },
            { key: "spent", icon: Wallet, bg: "#E5EFFC", fg: "#2F6FE0", value: `Tk ${totalSpent.toLocaleString()}`, label: "Total Spent", sub: `of Tk ${budget.toLocaleString()}`, progress: spentPct },
            { key: "travelers", icon: Users, bg: "#FDEFE4", fg: "#E08A20", value: String(members.length), label: "Travelers", sub: "All Connected" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{
                background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 12,
                minWidth: 128, flexShrink: 0
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8
                }}>
                  <Icon size={14} color={s.fg} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", whiteSpace: "nowrap" }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{s.sub}</div>
                {s.progress !== undefined && (
                  <div style={{ background: "#F0F1EC", borderRadius: 999, height: 4, marginTop: 6 }}>
                    <div style={{ width: `${s.progress}%`, height: "100%", background: "#2F6FE0", borderRadius: 999 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 18, overflowX: "auto", borderBottom: "1px solid #ECEDE8", margin: "16px 0 0", paddingBottom: 2 }}>
          {tripTabs.map(t => {
            const Icon = t.icon;
            const active = activeTripTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTripTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 5, paddingBottom: 8,
                borderBottom: active ? "2px solid #6E4FD1" : "2px solid transparent",
                color: active ? "#6E4FD1" : "#8B8D86", fontWeight: 600, fontSize: 12.5
              }}>
                <Icon size={14} /> {t.name}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>

          {activeTripTab === "itinerary" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Today's Itinerary</span>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#6E4FD1", background: "#EFEAFB",
                  borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
                }}>Day 1 <ChevronDown size={12} /></span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: "14px 16px" }}>
                {todayItinerary.map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <div key={it.key} style={{ display: "flex", gap: 12, position: "relative" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 60, flexShrink: 0 }}>
                        <div style={{ fontSize: 10.5, color: "#8B8D86", marginBottom: 6, whiteSpace: "nowrap" }}>{it.time}</div>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `2px solid ${it.fg}`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>
                          <Icon size={13} color={it.fg} />
                        </div>
                        {i < todayItinerary.length - 1 && <div style={{ width: 2, flex: 1, background: "#ECEDE8", marginTop: 2 }} />}
                      </div>
                      <div style={{ paddingBottom: 18, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{it.title}</div>
                          <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{it.sub}</div>
                        </div>
                        {it.done && <CheckCircle2 size={17} color="#1F8A5A" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Places to Visit</span>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {placesToVisit.map(p => (
                  <div key={p.key} style={{ flexShrink: 0, width: 96 }}>
                    <div style={{ width: 96, height: 72, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin size={20} color="#fff" />
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", marginTop: 6 }}>{p.name}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 12, textAlign: "center" }}>
                Itinerary items are illustrative for now - real add/edit is a future step.
              </div>
            </>
          )}

          {activeTripTab === "expenses" && (
            <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Live Expense Summary</span>
                <button onClick={() => setShowAddExpense(o => !o)} style={{
                  display: "flex", alignItems: "center", gap: 4, background: "#EFEAFB", color: "#6E4FD1",
                  fontSize: 12, fontWeight: 600, borderRadius: 999, padding: "5px 10px", border: "none", cursor: "pointer"
                }}>
                  <Plus size={12} /> Add Expense
                </button>
              </div>

              {showAddExpense && (
                <div style={{ background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12, marginBottom: 14 }}>
                  <input
                    value={newExpenseDesc}
                    onChange={e => setNewExpenseDesc(e.target.value)}
                    placeholder="What was it for?"
                    style={{ width: "100%", borderRadius: 8, border: "1px solid #ECEDE8", padding: "8px 10px", fontSize: 12.5, marginBottom: 8, boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                      type="number"
                      value={newExpenseAmount}
                      onChange={e => setNewExpenseAmount(e.target.value)}
                      placeholder="Tk Amount"
                      style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "8px 10px", fontSize: 12.5 }}
                    />
                    <select
                      value={newExpenseCategory}
                      onChange={e => setNewExpenseCategory(e.target.value)}
                      style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "8px 10px", fontSize: 12.5 }}
                    >
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86", marginBottom: 8 }}>
                    Split equally among all {members.length} current members. Paid by you.
                  </div>
                  <button onClick={handleAddExpense} disabled={savingExpense} style={{
                    width: "100%", background: GREEN, color: "#fff", border: "none", borderRadius: 8,
                    padding: "8px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer", opacity: savingExpense ? 0.7 : 1
                  }}>{savingExpense ? "Saving..." : "Save Expense"}</button>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#8B8D86" }}>Total Spent</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#E0435A" }}>Tk {totalSpent.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#8B8D86" }}>Remaining Budget</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: remaining >= 0 ? "#1F8A5A" : "#E0435A" }}>Tk {remaining.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ background: "#F0F1EC", borderRadius: 999, height: 6, marginTop: 10 }}>
                <div style={{ width: `${spentPct}%`, height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 6 }}>{spentPct}% of Tk {budget.toLocaleString()}</div>

              <div style={{ margin: "18px 0 8px" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>All Expenses ({expenses.length})</span>
              </div>
              {expenses.length === 0 ? (
                <div style={{ fontSize: 12.5, color: "#6b6d66", padding: "10px 0" }}>No expenses logged yet.</div>
              ) : (
                [...expenses].reverse().map((e, i) => (
                  <div key={e.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                    borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", background: "#E4F3EA",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      fontWeight: 700, fontSize: 10.5, color: GREEN
                    }}>{e.category?.slice(0, 2).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{e.description}</div>
                      <div style={{ fontSize: 11, color: "#8B8D86" }}>{e.category} - Paid by {e.paidByName}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Tk {(e.amount || 0).toLocaleString()}</div>
                  </div>
                ))
              )}

              <div style={{ margin: "18px 0 8px" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>Balances</span>
              </div>
              {memberBalances.map((m, i) => (
                <div key={m.uid} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", background: "#E4F3EA",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontWeight: 700, fontSize: 11, color: GREEN
                  }}>{getInitialsFrom(m.name)}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{m.name}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.amountLabel}</div>
                    <div style={{ fontSize: 10, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.statusLabel}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTripTab === "members" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Trip Members ({members.length})</span>
                <button onClick={() => setShowAddTraveler(o => !o)} style={{
                  background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 13,
                  display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
                }}>
                  <UserPlus size={14} /> Add Traveler
                </button>
              </div>

              {showAddTraveler && (
                <div style={{ marginBottom: 14 }}>
                  <ConnectByCareId
                    label="Invite a traveler by their CARE ID"
                    onFind={handleFindTraveler}
                    onSent={handleSendTripInvite}
                  />
                </div>
              )}

              {incomingTripRequests.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle>Trip Invitations for You</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {incomingTripRequests.map(r => (
                      <PendingRequestCard
                        key={r.id} name={r.fromName} sub="Invited you to a trip"
                        initials={getInitialsFrom(r.fromName)} bg="#E5EFFC" fg="#2F6FE0"
                        onAccept={() => handleTripAccept(r)} onDecline={() => handleTripDecline(r)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tripConnectedNote && (
                <div style={{
                  background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
                }}>
                  <CheckCircle2 size={16} color={GREEN} /> {tripConnectedNote}
                </div>
              )}

              <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
                {memberBalances.map((m, i) => (
                  <div key={m.uid} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                    borderBottom: i < memberBalances.length - 1 ? "1px solid #F0F1EC" : "none"
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: m.uid === currentUser?.uid ? GREEN : "#E4F3EA",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 13, color: m.uid === currentUser?.uid ? "#fff" : GREEN, flexShrink: 0
                    }}>{getInitialsFrom(m.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{m.name}{m.uid === currentUser?.uid ? " (You)" : ""}</div>
                      <div style={{ fontSize: 11, color: "#8B8D86", textTransform: "capitalize" }}>{m.role}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.amountLabel}</div>
                      <div style={{ fontSize: 10, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.statusLabel}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
                  <MessageCircle size={16} /> Trip Chat
                </span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
                {tripChat.map((c, i) => (
                  <div key={c.key} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
                    borderBottom: i < tripChat.length - 1 ? "1px solid #F0F1EC" : "none"
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", background: "#E5EFFC",
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#2F6FE0", flexShrink: 0
                    }}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#6b6d66" }}>{c.msg}</div>
                    </div>
                    <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{c.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 8, textAlign: "center" }}>
                Trip Chat is illustrative for now - real messaging is a future step.
              </div>
            </>
          )}

          {activeTripTab === "checklists" && (
            <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1F8A5A" }}>{packedCount} / {checklist.length}</div>
                  <div style={{ fontSize: 12, color: "#8B8D86", marginBottom: 8 }}>Items Packed</div>
                  <div style={{ background: "#F0F1EC", borderRadius: 999, height: 5 }}>
                    <div style={{ width: `${checklistPct}%`, height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
                  </div>
                </div>
                <Backpack size={44} color="#1F8A5A" strokeWidth={1.4} />
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <input
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addChecklistItem(); }}
                  placeholder="Add an item to pack..."
                  style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "8px 10px", fontSize: 12.5 }}
                />
                <button onClick={addChecklistItem} style={{
                  background: GREEN, border: "none", borderRadius: 8, padding: "8px 14px",
                  fontSize: 12.5, fontWeight: 600, color: "#fff", cursor: "pointer"
                }}>Add</button>
              </div>
              {checklist.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                    borderTop: i > 0 ? "1px solid #F0F1EC" : "none", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left"
                  }}
                >
                  {item.packed
                    ? <CheckCircle2 size={19} color={GREEN} style={{ flexShrink: 0 }} />
                    : <Square size={19} color="#c7c8c2" style={{ flexShrink: 0 }} />
                  }
                  <span style={{
                    fontSize: 13.5, color: item.packed ? "#8B8D86" : "#1A1A1A",
                    textDecoration: item.packed ? "line-through" : "none"
                  }}>{item.label}</span>
                </button>
              ))}
              <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 10, textAlign: "center" }}>
                Checklist works during this visit but isn't saved to your account yet.
              </div>
            </div>
          )}

          {activeTripTab === "bookings" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Your Bookings</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {bookings.map(b => {
                  const Icon = b.icon;
                  return (
                    <div key={b.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12, background: b.bg,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>
                          <Icon size={19} color={b.fg} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10.5, fontWeight: 600, color: b.fg, textTransform: "uppercase" }}>{b.type}</div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1A1A1A" }}>{b.name}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, color: "#6b6d66", marginBottom: 8 }}>{b.detail}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#1A1A1A", marginBottom: 4 }}>
                        <Clock size={13} color="#8B8D86" /> {b.checkin}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#1A1A1A" }}>
                        <Clock size={13} color="#8B8D86" /> {b.checkout}
                      </div>
                      <div style={{
                        marginTop: 10, paddingTop: 10, borderTop: "1px solid #F0F1EC",
                        fontSize: 11, color: "#8B8D86", display: "flex", justifyContent: "space-between"
                      }}>
                        <span>Booking ref</span>
                        <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{b.ref}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 12, textAlign: "center" }}>
                Bookings are illustrative for now - real add/edit is a future step.
              </div>
            </>
          )}

          {activeTripTab === "more" && (
            <>
              <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
                {[
                  { key: "settings", label: "Trip Settings", icon: Settings, fg: "#6b6d66" },
                  { key: "share", label: "Share Trip", icon: Share2, fg: "#2F6FE0" },
                  { key: "invite", label: "Invite by CARE ID", icon: UserPlus, fg: GREEN, onClick: () => { setActiveTripTab("members"); setShowAddTraveler(true); } },
                  { key: "contact", label: "Emergency Contacts", icon: Phone, fg: "#E08A20" },
                ].map((m, i, arr) => {
                  const Icon = m.icon;
                  return (
                    <button key={m.key} onClick={m.onClick} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid #F0F1EC" : "none", background: "none",
                      border: "none", cursor: "pointer", textAlign: "left"
                    }}>
                      <Icon size={17} color={m.fg} />
                      <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <button style={{
                width: "100%", background: "#FCE9EB", border: "none", borderRadius: 14, color: "#E0435A",
                padding: "13px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 20
              }}>
                <LogOut size={16} /> Leave Trip
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
