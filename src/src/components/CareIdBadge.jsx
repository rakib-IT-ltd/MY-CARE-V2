import React, { useState } from "react";
import { CreditCard, CheckCircle2, Copy } from "lucide-react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN } from "../constants/colors";
import { CARE_ID } from "../constants/careDirectory";

export default function CareIdBadge({ compact }) {
  const currentUser = useCurrentUser();
  const careId = currentUser?.careId || CARE_ID;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(careId);
    } catch (err) {
      // clipboard API unavailable — fail silently, badge still shows the ID to copy manually
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: compact ? 6 : 8, background: "#EFEAFB",
      color: "#6E4FD1", fontWeight: 600, fontSize: compact ? 11 : 12.5,
      borderRadius: 999, padding: compact ? "4px 6px 4px 10px" : "6px 8px 6px 12px"
    }}>
      <CreditCard size={compact ? 12 : 14} /> {careId}
      <button
        onClick={handleCopy}
        title="Copy CARE ID"
        style={{
          background: copied ? GREEN : "rgba(255,255,255,0.7)", border: "none",
          borderRadius: "50%", width: compact ? 20 : 24, height: compact ? 20 : 24,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          color: copied ? "#fff" : "#6E4FD1", flexShrink: 0
        }}
      >
        {copied ? <CheckCircle2 size={compact ? 11 : 13} /> : <Copy size={compact ? 11 : 13} />}
      </button>
    </div>
  );
}
