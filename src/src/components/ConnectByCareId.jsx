import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { GREEN } from "../constants/colors";
import { CARE_DIRECTORY } from "../constants/careDirectory";

export default function ConnectByCareId({ label, placeholder, onSent, onFind }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | notfound | found | sent | error
  const [profile, setProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFind = async () => {
    const id = input.trim().toUpperCase();
    if (!id) return;
    setErrorMsg("");
    if (onFind) {
      setStatus("loading");
      try {
        const match = await onFind(id);
        if (match) { setProfile(match); setStatus("found"); }
        else { setProfile(null); setStatus("notfound"); }
      } catch (err) {
        setProfile(null);
        setErrorMsg(err.message || "Something went wrong looking that up.");
        setStatus("error");
      }
    } else {
      const match = CARE_DIRECTORY[id];
      if (match) { setProfile(match); setStatus("found"); }
      else { setProfile(null); setStatus("notfound"); }
    }
  };

  const handleSend = async () => {
    if (onSent) {
      try {
        await onSent(profile);
      } catch (err) {
        setErrorMsg(err.message || "Couldn't send the request. Try again.");
        setStatus("error");
        return;
      }
    }
    setStatus("sent");
  };

  const reset = () => { setInput(""); setStatus("idle"); setProfile(null); setErrorMsg(""); };

  return (
    <div style={{ background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>
        {label || "Add by CARE ID"}
      </div>

      {status !== "sent" && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholder || "e.g. CARE-58213-AH"}
            style={{
              flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "9px 10px",
              fontSize: 12.5, background: "#fff", color: "#1A1A1A"
            }}
          />
          <button onClick={handleFind} disabled={status === "loading"} style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px",
            fontWeight: 600, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap",
            opacity: status === "loading" ? 0.7 : 1
          }}>{status === "loading" ? "Finding..." : "Find"}</button>
        </div>
      )}

      {status === "notfound" && (
        <div style={{ fontSize: 11.5, color: "#E0435A", marginTop: 8 }}>
          No user found with that CARE ID. Double-check and try again.
        </div>
      )}

      {status === "error" && (
        <div style={{ fontSize: 11.5, color: "#E0435A", marginTop: 8 }}>
          {errorMsg}
        </div>
      )}

      {status === "found" && profile && (
        <div style={{
          marginTop: 10, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12,
          padding: 12, display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", background: profile.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: profile.fg, flexShrink: 0
          }}>{profile.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{profile.name}</div>
            <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{profile.phone}</div>
          </div>
          <button onClick={handleSend} style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px",
            fontWeight: 600, fontSize: 12, cursor: "pointer"
          }}>Add</button>
        </div>
      )}

      {status === "sent" && profile && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={17} color={GREEN} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#1A1A1A", flex: 1, lineHeight: 1.5 }}>
            Request sent to <b>{profile.name}</b>. They'll get an Accept/Decline prompt — you'll be
            connected once they accept.
          </div>
          <button onClick={reset} style={{
            background: "none", border: "none", color: GREEN, fontSize: 11.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
          }}>Add another</button>
        </div>
      )}
    </div>
  );
}
