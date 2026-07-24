import React from "react";
import { GREEN } from "../constants/colors";

export default function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
      <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>{children}</span>
      {action && <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>{action}</span>}
    </div>
  );
}
