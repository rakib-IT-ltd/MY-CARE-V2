import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home as HomeIcon, Search, Bell, Plus, User } from "lucide-react";
import { GREEN, GREEN_DARK } from "./constants/colors";
import MenuDrawer from "./components/MenuDrawer";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", background: "linear-gradient(180deg,#F3FAF6 0%,#F7F8F4 220px)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: 700, position: "relative", paddingBottom: 78,
      borderRadius: 28, overflow: "hidden", border: "1px solid #e7e8e2"
    }}>
      <Outlet context={{ onOpenMenu: () => setMenuOpen(true) }} />

      {/* Bottom Nav */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff",
        borderTop: "1px solid #ECEDE8", display: "flex", alignItems: "center",
        padding: "10px 4px 14px"
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "space-around" }}>
          <button onClick={() => navigate("/")}
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <HomeIcon size={20} color={isHome ? GREEN : "#9a9c95"} />
            <span style={{ fontSize: 10.5, color: isHome ? GREEN : "#9a9c95", fontWeight: 600 }}>Home</span>
          </button>
          <button style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <Search size={20} color="#9a9c95" />
            <span style={{ fontSize: 10.5, color: "#9a9c95", fontWeight: 600 }}>Search</span>
          </button>
        </div>

        <button onClick={() => navigate("/")} style={{
          width: 48, height: 48, borderRadius: "50%", background: GREEN_DARK, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", marginTop: -22,
          boxShadow: "0 4px 10px rgba(31,138,90,0.35)", cursor: "pointer", flexShrink: 0
        }}>
          <Plus size={22} color="#fff" />
        </button>

        <div style={{ flex: 1, display: "flex", justifyContent: "space-around" }}>
          <button style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", position: "relative" }}>
            <Bell size={20} color="#9a9c95" />
            <span style={{
              position: "absolute", top: -4, right: 6, background: "#E0435A", color: "#fff",
              fontSize: 8, fontWeight: 700, borderRadius: "50%", width: 13, height: 13,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
            <span style={{ fontSize: 10.5, color: "#9a9c95", fontWeight: 600 }}>Notifications</span>
          </button>
          <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <User size={20} color={isProfile ? GREEN : "#9a9c95"} />
            <span style={{ fontSize: 10.5, color: isProfile ? GREEN : "#9a9c95", fontWeight: 600 }}>Profile</span>
          </button>
        </div>
      </div>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
