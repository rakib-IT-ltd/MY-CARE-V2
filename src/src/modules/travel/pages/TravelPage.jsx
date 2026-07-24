import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Backpack, Bell, Calendar, CheckCircle2, ChevronDown, MapPin, Menu, Pencil, Plus,
  Radio, Sun, UserPlus, Users, Wallet, Waves, Wallet2, Building2, Bus, List, Receipt,
  CheckSquare, MoreHorizontal, Droplet, Utensils, Car, Sunrise, DoorOpen,
} from "lucide-react";
import { GREEN } from "../../../constants/colors";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";
import ConnectByCareId from "../../../components/ConnectByCareId";
import PendingRequestCard from "../../../components/PendingRequestCard";
import SectionTitle from "../../../components/SectionTitle";

const tripStats = [
  { key: "days", icon: Calendar, bg: "#E4F3EA", fg: "#1F8A5A", value: "3", label: "Days Left", sub: "Total Duration" },
  { key: "spent", icon: Wallet2, bg: "#E5EFFC", fg: "#2F6FE0", value: "৳ 4,350", label: "Total Spent", sub: "of ৳ 20,000", progress: 22 },
  { key: "travelers", icon: Users, bg: "#FDEFE4", fg: "#E08A20", value: "10", label: "Travelers", sub: "All Connected" },
  { key: "hotel", icon: Building2, bg: "#EFEAFB", fg: "#6E4FD1", value: "Sea View Hotel", label: "Check-in", sub: "18 Dec, 2:30 PM" },
  { key: "bus", icon: Bus, bg: "#FDF0DF", fg: "#E08A20", value: "Green Line", label: "Bus", sub: "08:00 AM" },
];

const tripTabs = [
  { key: "itinerary", name: "Itinerary", icon: List },
  { key: "expenses", name: "Expenses", icon: Receipt },
  { key: "members", name: "Members", icon: Users },
  { key: "checklists", name: "Checklists", icon: CheckSquare },
  { key: "bookings", name: "Bookings", icon: Backpack },
  { key: "more", name: "More", icon: MoreHorizontal },
];

const recentExpenses = [
  { key: "water", name: "Water (10 bottle)", meta: "Today, 09:30 AM", amount: "৳ 100", paidBy: "Paid by You", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "lunch", name: "Lunch at Poushee", meta: "Today, 01:45 PM", amount: "৳ 2,100", paidBy: "Paid by Karim", icon: Utensils, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "taxi", name: "Taxi to Himchari", meta: "Today, 04:10 PM", amount: "৳ 350", paidBy: "Paid by Rahim", icon: Car, bg: "#E4F3EA", fg: "#1F8A5A" },
];

const memberBalances = [
  { key: "you", name: "You", initials: "RH", amount: "৳ 870", status: "Will receive", positive: true, highlight: true },
  { key: "karim", name: "Karim", initials: "K", amount: "৳ 250", status: "Will receive", positive: true },
  { key: "hasan", name: "Hasan", initials: "H", amount: "৳ 370", status: "Owes you", positive: false },
  { key: "rahim", name: "Rahim", initials: "R", amount: "৳ 420", status: "Owes you", positive: false },
  { key: "rafi", name: "Rafi", initials: "Rf", amount: "৳ 190", status: "Owes you", positive: false },
];

const todayItinerary = [
  { key: "wake", time: "05:30 AM", title: "Wake Up", sub: "Get ready for an amazing trip", icon: Sunrise, fg: "#6E4FD1", done: true },
  { key: "leave", time: "06:30 AM", title: "Leave Home", sub: "Start your journey", icon: DoorOpen, fg: "#1F8A5A", done: true },
  { key: "bus", time: "08:00 AM", title: "Bus Departs", sub: "Green Line, Dhaka → Cox's Bazar", icon: Bus, fg: "#2F6FE0", done: true },
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

export default function TravelPage() {
  const navigate = useNavigate();
  const [activeTripTab, setActiveTripTab] = useState("itinerary");
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [incomingTripRequests, setIncomingTripRequests] = useState([
    { key: "rafi2", name: "Rafi", sub: "Wants to join Cox's Bazar Trip", initials: "Rf", bg: "#E5EFFC", fg: "#2F6FE0" },
  ]);
  const [tripConnectedNote, setTripConnectedNote] = useState("");

  const handleTripAccept = (key) => {
    const req = incomingTripRequests.find(r => r.key === key);
    setIncomingTripRequests(rs => rs.filter(r => r.key !== key));
    if (req) setTripConnectedNote(`${req.name} has joined the trip.`);
  };
  const handleTripDecline = (key) => {
    setIncomingTripRequests(rs => rs.filter(r => r.key !== key));
  };

  return (
    <div>
      {/* Header */}
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
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Trip hero card */}
        <div style={{
          borderRadius: 18, overflow: "hidden", position: "relative", margin: "10px 0",
          background: "linear-gradient(160deg,#BFE3F0 0%,#DCEAC9 55%,#E8D9A6 100%)",
          padding: "18px 18px 70px"
        }}>
          <Sun size={38} color="#F2A93B" style={{ position: "absolute", top: 14, right: 18, opacity: 0.9 }} />
          <Waves size={160} color="#ffffff" style={{ position: "absolute", bottom: -10, right: -20, opacity: 0.35 }} />
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", position: "relative" }}>
            Cox's Bazar Trip 🌴
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Calendar size={14} /> 18 Dec (Wed) – 21 Dec (Sat) 2025
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Users size={14} /> 10 Travelers
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Wallet size={14} /> Budget: ৳ 20,000
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

        {/* Stats scroll row */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginTop: -50, position: "relative" }}>
          {tripStats.map(s => {
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
                {s.progress && (
                  <div style={{ background: "#F0F1EC", borderRadius: 999, height: 4, marginTop: 6 }}>
                    <div style={{ width: `${s.progress}%`, height: "100%", background: "#2F6FE0", borderRadius: 999 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
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

        {/* Live Expense Summary */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Live Expense Summary</span>
            <span style={{
              display: "flex", alignItems: "center", gap: 4, background: "#EFEAFB", color: "#6E4FD1",
              fontSize: 12, fontWeight: 600, borderRadius: 999, padding: "5px 10px"
            }}>
              <Plus size={12} /> Add Expense
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>Total Spent</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#E0435A" }}>৳ 4,350</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>Remaining Budget</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1F8A5A" }}>৳ 15,650</div>
            </div>
          </div>
          <div style={{ background: "#F0F1EC", borderRadius: 999, height: 6, marginTop: 10 }}>
            <div style={{ width: "22%", height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 6 }}>21.75% of ৳ 20,000</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 8px" }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>Recent Expenses</span>
            <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>View All</span>
          </div>
          {recentExpenses.map((e, i) => {
            const Icon = e.icon;
            return (
              <div key={e.key} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: e.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={14} color={e.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "#8B8D86" }}>{e.meta}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{e.amount}</div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{e.paidBy}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Balance */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Member Balance</span>
          <button onClick={() => setShowAddTraveler(o => !o)} style={{
            background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 13,
            display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
          }}>
            <UserPlus size={14} /> Add Traveler
          </button>
        </div>

        {showAddTraveler && (
          <div style={{ marginBottom: 14 }}>
            <ConnectByCareId label="Invite a traveler by their CARE ID" />
          </div>
        )}

        {incomingTripRequests.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionTitle>Connection Requests</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {incomingTripRequests.map(r => (
                <PendingRequestCard
                  key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                  onAccept={() => handleTripAccept(r.key)} onDecline={() => handleTripDecline(r.key)}
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

        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {memberBalances.map(m => (
            <div key={m.key} style={{
              background: "#fff", border: m.highlight ? `2px solid ${GREEN}` : "1px solid #ECEDE8",
              borderRadius: 14, padding: "14px 12px", minWidth: 92, flexShrink: 0, textAlign: "center"
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: "#E4F3EA", margin: "0 auto 8px",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: GREEN
              }}>{m.initials}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{m.name}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: m.positive ? "#1F8A5A" : "#E0435A", marginTop: 4 }}>{m.amount}</div>
              <div style={{ fontSize: 10, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.status}</div>
            </div>
          ))}
        </div>

        {/* Today's Itinerary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
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
          <button style={{
            width: "100%", background: "#6E4FD1", border: "none", borderRadius: 12, color: "#fff",
            padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 4
          }}>
            <Calendar size={15} /> View Full Itinerary
          </button>
        </div>

        {/* Trip Checklist */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Trip Checklist</span>
        </div>
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16,
          display: "flex", alignItems: "center", gap: 14
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1F8A5A" }}>12 / 18</div>
            <div style={{ fontSize: 12, color: "#8B8D86", marginBottom: 8 }}>Items Packed</div>
            <div style={{ background: "#F0F1EC", borderRadius: 999, height: 5 }}>
              <div style={{ width: "66%", height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
            </div>
            <button style={{
              marginTop: 10, background: "#E4F3EA", border: "none", borderRadius: 999, color: GREEN,
              fontWeight: 600, fontSize: 12.5, padding: "7px 14px", cursor: "pointer"
            }}>Open Checklist</button>
          </div>
          <Backpack size={54} color="#1F8A5A" strokeWidth={1.4} />
        </div>

        {/* Places to Visit */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Places to Visit</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>See All</span>
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

        {/* Trip Chat */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Trip Chat</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>See All</span>
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
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{c.time}</div>
                {c.badge && (
                  <span style={{
                    display: "inline-block", marginTop: 4, background: "#1F8A5A", color: "#fff",
                    fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, lineHeight: "16px"
                  }}>{c.badge}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

