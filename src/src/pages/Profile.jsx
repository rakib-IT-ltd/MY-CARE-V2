import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Bell, Shield, Settings, HelpCircle, ChevronRight, Phone, Mail, LogOut,
} from "lucide-react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { signOutUser } from "../firebase/auth";
import { GREEN } from "../constants/colors";
import CareIdBadge from "../components/CareIdBadge";

export default function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const name = currentUser?.name || "New User";
  const email = currentUser?.email || "";
  const initials = currentUser?.initials || "NA";

  const profileMenu = [
    { key: "edit", name: "Edit Profile", icon: User },
    { key: "notifications", name: "Notification Settings", icon: Bell },
    { key: "privacy", name: "Privacy & Security", icon: Shield },
    { key: "settings", name: "App Settings", icon: Settings },
    { key: "help", name: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Profile</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        {/* Identity card */}
        <div style={{
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", borderRadius: 18, padding: 20,
          display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0 16px", textAlign: "center"
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%", background: "#fff", border: "3px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 26, color: GREEN, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>{initials}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{name}</div>
          <div style={{ fontSize: 12.5, color: "#6b6d66", marginTop: 2 }}>{email}</div>
          <div style={{ marginTop: 12 }}>
            <CareIdBadge />
          </div>
        </div>

        {/* Quick contact info */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0F1EC" }}>
            <Phone size={16} color="#2F6FE0" />
            <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>Add a phone number</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
            <Mail size={16} color="#E08A20" />
            <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{email}</span>
          </div>
        </div>

        {/* Menu list */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {profileMenu.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={m.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                borderBottom: i < profileMenu.length - 1 ? "1px solid #F0F1EC" : "none", cursor: "pointer"
              }}>
                <Icon size={17} color="#6b6d66" />
                <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{m.name}</span>
                <ChevronRight size={16} color="#c7c8c2" />
              </div>
            );
          })}
        </div>

        <button onClick={() => signOutUser()} style={{
          width: "100%", background: "#FCE9EB", border: "none", borderRadius: 14, color: "#E0435A",
          padding: "13px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 20
        }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}
