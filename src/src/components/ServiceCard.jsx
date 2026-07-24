import React from "react";
import { ChevronRight } from "lucide-react";

export default function ServiceCard({ s, onOpen }) {
  const Icon = s.icon;
  return (
    <button
      onClick={() => onOpen(s)}
      style={{
        textAlign: "left",
        background: s.bg,
        border: "none",
        borderRadius: 16,
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={22} color={s.fg} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>{s.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#6b6d66" }}>
          {s.sub} <ChevronRight size={13} />
        </div>
      </div>
    </button>
  );
}
