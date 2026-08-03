import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Bell, Shield, Settings, HelpCircle, ChevronRight, Phone, Mail, LogOut, Pencil, CheckCircle2,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { signOutUser } from "../firebase/auth";
import { GREEN, GREEN_DARK } from "../constants/colors";
import CareIdBadge from "../components/CareIdBadge";

export default function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const name = currentUser?.name || "New User";
  const email = currentUser?.email || "";
  const initials = currentUser?.initials || "NA";

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || "");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSavePhone = async () => {
    const trimmed = phoneInput.trim();
    if (!trimmed) {
      setPhoneError("Enter a phone number first.");
      return;
    }
    setPhoneError("");
    setSavingPhone(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { phone: trimmed });
      await currentUser.refreshProfile();
      setEditingPhone(false);
    } catch (err) {
      setPhoneError(err.message || "Couldn't save. Try again.");
    } finally {
      setSavingPhone(false);
    }
  };

  const profileMenu = [
    { key: "edit", name: "Edit Profile", icon: User, onClick: () => navigate("/profile/edit") },
    { key: "notifications", name: "Notification Settings", icon: Bell, onClick: () => navigate("/profile/notifications") },
    { key: "privacy", name: "Privacy & Security", icon: Shield, onClick: () => navigate("/profile/privacy") },
    { key: "settings", name: "App Settings", icon: Settings, onClick: () => navigate("/profile/settings") },
    { key: "help", name: "Help & Support", icon: HelpCircle, onClick: () => navigate("/profile/help") },
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
          {editingPhone ? (
            <div style={{ padding: "12px 0", borderBottom: "1px solid #F0F1EC" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  autoFocus
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #ECEDE8",
                    fontSize: 13.5, boxSizing: "border-box"
                  }}
                />
                <button onClick={handleSavePhone} disabled={savingPhone} style={{
                  background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 8,
                  padding: "9px 14px", fontWeight: 600, fontSize: 12.5, cursor: "pointer",
                  opacity: savingPhone ? 0.7 : 1, whiteSpace: "nowrap"
                }}>
                  {savingPhone ? "Saving..." : "Save"}
                </button>
              </div>
              {phoneError && <div style={{ color: "#E0435A", fontSize: 11.5, marginTop: 6 }}>{phoneError}</div>}
              <button onClick={() => { setEditingPhone(false); setPhoneError(""); }} style={{
                background: "none", border: "none", color: "#8B8D86", fontSize: 11.5, marginTop: 6, cursor: "pointer", padding: 0
              }}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setPhoneInput(currentUser?.phone || ""); setEditingPhone(true); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: "1px solid #F0F1EC", background: "none", border: "none", cursor: "pointer", textAlign: "left"
              }}
            >
              <Phone size={16} color="#2F6FE0" />
              <span style={{ fontSize: 13.5, color: currentUser?.phone ? "#1A1A1A" : "#8B8D86", flex: 1 }}>
                {currentUser?.phone || "Add a phone number"}
              </span>
              {currentUser?.phone ? <Pencil size={14} color="#c7c8c2" /> : <ChevronRight size={16} color="#c7c8c2" />}
            </button>
          )}
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
              <div key={m.key} onClick={m.onClick} style={{
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
