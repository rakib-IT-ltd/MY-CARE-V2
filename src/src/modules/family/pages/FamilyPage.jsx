import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Bell, Calendar, CheckCircle2, ChevronRight, Gift, Menu, Share2,
  ShieldCheck, TreePine, UserPlus, Users, User, UserRound, Smile, NotebookPen, Image, Heart,
} from "lucide-react";
import { GREEN } from "../../../constants/colors";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";
import ConnectByCareId from "../../../components/ConnectByCareId";
import PendingRequestCard from "../../../components/PendingRequestCard";
import SectionTitle from "../../../components/SectionTitle";

const familyStats = [
  { key: "total", label: "Family Members", sub: "All connected", value: "12", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "male", label: "Male Members", sub: "In your family", value: "5", icon: User, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "female", label: "Female Members", sub: "In your family", value: "7", icon: UserRound, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "children", label: "Children", sub: "Our little stars", value: "4", icon: Smile, bg: "#FDF0DF", fg: "#E08A20" },
];

const familyQuickActions = [
  { key: "tree", name: "View Tree", sub: "See family tree", icon: TreePine, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "add", name: "Add Member", sub: "Add new member", icon: UserPlus, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "note", name: "Family Note", sub: "Add family note", icon: NotebookPen, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "album", name: "Photo Album", sub: "View memories", icon: Image, bg: "#FDF0DF", fg: "#E08A20" },
];

const familyMembers = [
  { key: "father", name: "Abdul Karim", relation: "Father", dob: "12 Mar 1965", badge: "Head", badgeColor: GREEN, relColor: "#1F8A5A", initials: "AK", avatarBg: "#E4F3EA", avatarFg: "#1F8A5A" },
  { key: "mother", name: "Salma Begum", relation: "Mother", dob: "18 Jul 1968", badge: "Mother", badgeColor: "#C4457B", relColor: "#C4457B", initials: "SB", avatarBg: "#FCE9EB", avatarFg: "#C4457B" },
  { key: "you", name: "Rakib Hasan", relation: "Son", dob: "25 Jan 1998", badge: "You", badgeColor: GREEN, relColor: "#2F6FE0", initials: "RH", avatarBg: "#E4F3EA", avatarFg: "#1F8A5A" },
  { key: "wife", name: "Nusrat Jahan", relation: "Wife", dob: "12 May 1999", badge: "Wife", badgeColor: "#E0435A", relColor: "#E0435A", initials: "NJ", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
  { key: "son", name: "Ahnaf Hasan", relation: "Son", dob: "10 Aug 2018", badge: null, relColor: "#2F6FE0", initials: "AH", avatarBg: "#E5EFFC", avatarFg: "#2F6FE0" },
  { key: "daughter", name: "Ayesha Hasan", relation: "Daughter", dob: "15 Feb 2021", badge: null, relColor: "#E0435A", initials: "AH", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
  { key: "brother", name: "Fahim Hasan", relation: "Brother", dob: "20 Nov 2001", badge: null, relColor: "#2F6FE0", initials: "FH", avatarBg: "#E5EFFC", avatarFg: "#2F6FE0" },
  { key: "sister", name: "Farhana Hasan", relation: "Sister", dob: "05 Apr 2004", badge: null, relColor: "#E0435A", initials: "FH", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
];

const upcomingBirthdays = [
  { key: "ahnaf", name: "Ahnaf Hasan", meta: "10 Aug (in 15 days)", initials: "AH", bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "nusrat", name: "Nusrat Jahan", meta: "12 May (in 56 days)", initials: "NJ", bg: "#FCE9EB", fg: "#E0435A" },
  { key: "karim", name: "Abdul Karim", meta: "12 Mar (in 96 days)", initials: "AK", bg: "#E4F3EA", fg: "#1F8A5A" },
];

function FamilyMemberCard({ m }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: "16px 16px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: m.avatarBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 20, color: m.avatarFg, margin: "0 auto"
        }}>
          {m.initials}
        </div>
        {m.badge && (
          <span style={{
            position: "absolute", top: 10, right: 10, background: m.badgeColor, color: "#fff",
            fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 9px"
          }}>{m.badge}</span>
        )}
      </div>
      <div style={{ textAlign: "center", padding: "10px 10px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>{m.name}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: m.relColor, margin: "2px 0 4px" }}>{m.relation}</div>
        <div style={{ fontSize: 11, color: "#8B8D86", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Calendar size={11} /> {m.dob}
        </div>
      </div>
    </div>
  );
}


export default function FamilyPage() {
  const navigate = useNavigate();
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([
    { key: "fahim2", name: "Fahim Hasan", sub: "Wants to join your Family Tree", initials: "FH", bg: "#E5EFFC", fg: "#2F6FE0" },
  ]);
  const [connectedNote, setConnectedNote] = useState("");

  const handleAccept = (key) => {
    const req = incomingRequests.find(r => r.key === key);
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
    if (req) setConnectedNote(`You're now connected with ${req.name} in your Family Tree.`);
  };
  const handleDecline = (key) => {
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
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
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Family Tree</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Stay connected. Always.</div>
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
        {/* Greeting banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "20px 20px",
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", maxWidth: 200 }}>
            Good Morning, Rakib! 👋
          </div>
          <div style={{ fontSize: 12.5, color: "#5b5d56", marginTop: 6, maxWidth: 190, lineHeight: 1.5 }}>
            Family is where life begins and love never ends.
          </div>
          <button onClick={() => setShowAddPanel(o => !o)} style={{
            marginTop: 12, background: "#fff", border: "1px solid #d6e9dc", color: GREEN,
            borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            <UserPlus size={14} /> Add Family Member
          </button>
          <TreePine size={78} color="#1F8A5A" style={{ position: "absolute", right: 8, top: 14, opacity: 0.9 }} />
        </div>

        {showAddPanel && (
          <div style={{ marginBottom: 14 }}>
            <ConnectByCareId
              label="Add a family member by their CARE ID"
            />
          </div>
        )}

        {incomingRequests.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionTitle>Connection Requests</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {incomingRequests.map(r => (
                <PendingRequestCard
                  key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                  onAccept={() => handleAccept(r.key)} onDecline={() => handleDecline(r.key)}
                />
              ))}
            </div>
          </div>
        )}

        {connectedNote && (
          <div style={{
            background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
          }}>
            <CheckCircle2 size={16} color={GREEN} /> {connectedNote}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Icon size={16} color={s.fg} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 10px" }}>
          <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Quick Actions</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyQuickActions.map(q => {
            const Icon = q.icon;
            return (
              <button key={q.key} style={{
                textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: q.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={q.fg} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{q.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* My Family */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>My Family</span>
          </div>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
            View All <ChevronRight size={14} />
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyMembers.map(m => <FamilyMemberCard key={m.key} m={m} />)}
        </div>

        <button style={{
          width: "100%", marginTop: 14, background: "#E4F3EA", border: "none", borderRadius: 14,
          padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, color: GREEN, fontWeight: 700, fontSize: 14.5, cursor: "pointer"
        }}>
          <Share2 size={16} /> View Full Family Tree <ArrowRight size={15} />
        </button>

        {/* Upcoming birthdays */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Upcoming Birthdays</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {upcomingBirthdays.map((b, i) => (
            <div key={b.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < upcomingBirthdays.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: b.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontWeight: 700, fontSize: 12, color: b.fg
              }}>{b.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{b.meta}</div>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Gift size={15} color={GREEN} />
              </div>
            </div>
          ))}
        </div>

        {/* Family Summary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Family Summary</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "4px 16px" }}>
          {[
            { icon: Users, fg: "#2F6FE0", label: "Generations", value: "3" },
            { icon: Heart, fg: "#E0435A", label: "Family Motto", value: '"Together We Grow"' },
            { icon: Calendar, fg: "#6E4FD1", label: "Family Created On", value: "01 Jan 2020" },
            { icon: ShieldCheck, fg: "#1F8A5A", label: "Privacy", value: "Only family members", arrow: true },
          ].map((row, i, arr) => {
            const Icon = row.icon;
            return (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "13px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <Icon size={16} color={row.fg} />
                <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{row.value}</span>
                {row.arrow && <ChevronRight size={15} color="#c7c8c2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

