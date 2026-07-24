import React from "react";

export default function QuickAction({ q }) {
  const Icon = q.icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "#fff", border: "1px solid #ECEDE8", borderRadius: 999,
      padding: "8px 14px", whiteSpace: "nowrap", flexShrink: 0
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: q.bg,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={13} color={q.fg} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: "#2B2B2B" }}>{q.name}</span>
    </div>
  );
}
