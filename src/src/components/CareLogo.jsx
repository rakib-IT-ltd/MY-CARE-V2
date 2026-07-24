import React from "react";

export default function CareLogo({ size = 34 }) {
  const letters = [
    { ch: "C", bg: "#F2A93B" },
    { ch: "A", bg: "#22B573" },
    { ch: "R", bg: "#3B82F6" },
    { ch: "E", bg: "#1CA6C2" },
  ];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, overflow: "hidden",
      display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
      flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
    }}>
      {letters.map(l => (
        <div key={l.ch} style={{
          background: l.bg, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: size * 0.34, lineHeight: 1
        }}>{l.ch}</div>
      ))}
    </div>
  );
}
