import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Menu, Search, Bell, ChevronRight, Plus, Star, Info, Trophy, ArrowRight } from "lucide-react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN } from "../constants/colors";
import { services, quickActions, activity } from "../constants/home";
import { SERVICE_ROUTES } from "../constants/routes";
import CareLogo from "../components/CareLogo";
import CareIdBadge from "../components/CareIdBadge";
import ServiceCard from "../components/ServiceCard";
import QuickAction from "../components/QuickAction";

export default function HomePage() {
  const { onOpenMenu } = useOutletContext();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const openService = (s) => navigate(SERVICE_ROUTES[s.key] || "/");

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onOpenMenu} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff",
            border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <Menu size={18} color="#1A1A1A" />
          </button>
          <CareLogo size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16.5, color: "#1A1A1A" }}>My Care</div>
            <div style={{ fontSize: 10.5, color: "#8B8D86", lineHeight: 1.3 }}>Everything That Matters.<br />One Place.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Search size={19} color="#1A1A1A" />
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <button onClick={() => navigate("/profile")} style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer"
          }}>
            <span style={{ fontWeight: 700, fontSize: 12.5, color: GREEN }}>{currentUser?.initials || "NA"}</span>
          </button>
        </div>
      </div>

      {/* Greeting banner */}
      <div style={{
        margin: "10px 20px", borderRadius: 18, padding: "22px 20px",
        background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>Good Morning, {(currentUser?.name || "there").split(" ")[0]}! 👋</div>
        <div style={{ fontSize: 13, color: "#5b5d56", marginTop: 6, maxWidth: 220, lineHeight: 1.5 }}>
          Have a great day! Stay organized, productive and take care.
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 0" }}>
          <CareIdBadge compact />
        </div>
        {/* My Services */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>My Services</span>
          </div>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
            See All <ChevronRight size={14} />
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {services.map(s => <ServiceCard key={s.key} s={s} onOpen={openService} />)}
        </div>

        {/* Add / Manage */}
        <button style={{
          width: "100%", marginTop: 14, background: "#E4F3EA", border: "none", borderRadius: 14,
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer"
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: GREEN,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Plus size={18} color="#fff" />
          </div>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1A1A1A" }}>Add / Manage Services</div>
            <div style={{ fontSize: 12, color: "#6b6d66" }}>Add new services or manage your services</div>
          </div>
          <ChevronRight size={18} color="#1A1A1A" />
        </button>

        {/* Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 10px" }}>
          <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Quick Actions</span>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {quickActions.map(q => <QuickAction key={q.key} q={q} />)}
        </div>

        {/* Recent Activity */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Activity</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {activity.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", margin: "6px 0",
                borderLeft: `3px solid ${a.fg}`, background: a.bg, borderRadius: 10
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={a.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{a.title}</div>
                  <div style={{ fontSize: 11.5, color: "#6b6d66" }}>{a.meta}</div>
                </div>
                <ChevronRight size={16} color="#a8a9a2" />
              </div>
            );
          })}
        </div>

        {/* Notice board */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Notice Board</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#FDF6E9", border: "1px solid #F5E7C4", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Star size={15} color="#E08A20" />
              <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: "#1A1A1A" }}>Hostel Meeting</span>
              <span style={{ color: "#E0435A", fontWeight: 600, fontSize: 11.5 }}>Important</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>
              A general meeting will be held today at 7:00 PM in the common room.
            </div>
            <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>17 June 2025 · 09:00 AM</div>
          </div>
          <div style={{ background: "#EAF1FC", border: "1px solid #D3E2F7", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Info size={15} color="#2F6FE0" />
              <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: "#1A1A1A" }}>School Examination</span>
              <span style={{ color: "#2F6FE0", fontWeight: 600, fontSize: 11.5, background: "#fff", padding: "2px 8px", borderRadius: 999 }}>Reminder</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>
              Final examination will start from 22 June 2025.
            </div>
            <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>17 June 2025 · 08:30 AM</div>
          </div>
        </div>

        {/* Motivation banner */}
        <div style={{
          margin: "20px 0", borderRadius: 16, padding: "16px 18px",
          background: "#EAF6EF", display: "flex", alignItems: "center", gap: 12
        }}>
          <Trophy size={26} color="#E08A20" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>Keep going, {(currentUser?.name || "").split(" ")[0]}! 🎉</div>
            <div style={{ fontSize: 12, color: "#6b6d66" }}>Complete your tasks and achieve your goals.</div>
          </div>
          <button style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 10,
            padding: "8px 12px", fontSize: 12, fontWeight: 600, display: "flex",
            alignItems: "center", gap: 4, whiteSpace: "nowrap", cursor: "pointer"
          }}>
            View Tasks <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </>
  );
}
