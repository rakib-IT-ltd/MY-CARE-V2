import React from "react";
import { GREEN } from "../constants/colors";

export default function PendingRequestCard({ name, sub, initials, bg, fg, onAccept, onDecline }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, background: "#fff",
      border: "1px solid #ECEDE8", borderRadius: 12, padding: 12
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 13, color: fg, flexShrink: 0
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#8B8D86" }}>{sub}</div>
      </div>
      <button onClick={onDecline} style={{
        background: "#fff", border: "1px solid #ECEDE8", borderRadius: 8, padding: "6px 10px",
        fontSize: 11.5, fontWeight: 600, color: "#6b6d66", cursor: "pointer"
      }}>Decline</button>
      <button onClick={onAccept} style={{
        background: GREEN, border: "none", borderRadius: 8, padding: "6px 12px",
        fontSize: 11.5, fontWeight: 600, color: "#fff", cursor: "pointer"
      }}>Accept</button>
    </div>
  );
}
