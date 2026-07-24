import React from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, User, Settings, HelpCircle, LogOut, X } from "lucide-react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { signOutUser } from "../firebase/auth";
import { GREEN } from "../constants/colors";
import { allServicesList } from "../constants/menu";
import { SERVICE_ROUTES } from "../constants/routes";
import CareLogo from "./CareLogo";

export default function MenuDrawer({ open, onClose }) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const name = currentUser?.name || "New User";
  const initials = currentUser?.initials || "NA";

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40,
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.2s"
        }}
      />
      <div style={{
        position: "fixed", top: 0, bottom: 0, left: 0, width: "78%", maxWidth: 300,
        background: "#fff", zIndex: 41, boxShadow: "2px 0 16px rgba(0,0,0,0.12)",
        transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.22s ease",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <div style={{ padding: "20px 18px 14px", background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <CareLogo size={36} />
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.7)", border: "none", borderRadius: "50%", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <X size={15} color="#1A1A1A" />
            </button>
          </div>
          <button onClick={() => go("/profile")} style={{
            display: "flex", alignItems: "center", gap: 10, background: "none", border: "none",
            padding: 0, marginTop: 14, cursor: "pointer", width: "100%", textAlign: "left"
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: GREEN, fontSize: 15
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>{name}</div>
              <div style={{ fontSize: 11, color: "#5b5d56" }}>View profile</div>
            </div>
          </button>
        </div>

        <div style={{ padding: "8px 10px" }}>
          <button onClick={() => go("/")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <HomeIcon size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Home</span>
          </button>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9c95", textTransform: "uppercase", padding: "12px 10px 4px" }}>
            My Services
          </div>
          {allServicesList.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => go(SERVICE_ROUTES[s.key])} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
                padding: "10px 10px", cursor: "pointer", borderRadius: 10
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={15} color={s.fg} />
                </div>
                <span style={{ fontSize: 13.5, color: "#1A1A1A" }}>{s.name}</span>
              </button>
            );
          })}

          <div style={{ height: 1, background: "#F0F1EC", margin: "10px 10px" }} />

          <button onClick={() => go("/profile")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <User size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Profile</span>
          </button>
          <button onClick={onClose} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <Settings size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Settings</span>
          </button>
          <button onClick={onClose} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <HelpCircle size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Help & Support</span>
          </button>
          <button onClick={() => { signOutUser(); onClose(); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10, color: "#E0435A"
          }}>
            <LogOut size={18} color="#E0435A" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
