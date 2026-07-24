import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { GREEN } from "../../../constants/colors";

export default function DailyTaskPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 14, padding: 0, marginBottom: 24, cursor: "pointer" }}
      >
        ← Back to home
      </button>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: "#EFEAFB",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
      }}>
        <ClipboardCheck size={28} color="#6E4FD1" />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#1A1A1A" }}>Daily Task</h2>
      <p style={{ margin: 0, color: "#6b6d66", fontSize: 14.5, lineHeight: 1.6 }}>
        This is a placeholder for the Daily Task module. Tell me what it should track or
        let me know its key screens, and I'll build it out next.
      </p>
    </div>
  );
}
