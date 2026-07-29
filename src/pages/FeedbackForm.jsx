import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, MessageSquare, Bug, Lightbulb, CheckCircle2 } from "lucide-react";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN, GREEN_DARK } from "../constants/colors";

const TYPE_CONFIG = {
  contact: {
    title: "Contact Support", icon: MessageSquare, fg: "#2F6FE0", bg: "#E5EFFC",
    placeholder: "What do you need help with?",
    intro: "Send us a message and we'll get back to you.",
  },
  bug: {
    title: "Report a Bug", icon: Bug, fg: "#E0435A", bg: "#FCE9EB",
    placeholder: "What went wrong? Please include which screen you were on.",
    intro: "Help us fix it by describing what happened.",
  },
  feature: {
    title: "Suggest a Feature", icon: Lightbulb, fg: "#E08A20", bg: "#FDF0DF",
    placeholder: "What would you like to see added or improved?",
    intro: "We'd love to hear your ideas.",
  },
};

export default function FeedbackFormPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const currentUser = useCurrentUser();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.contact;
  const Icon = config.icon;

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please write a message first.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await addDoc(collection(db, "feedback"), {
        type,
        message: message.trim(),
        fromUid: currentUser?.uid || null,
        fromName: currentUser?.name || "Unknown",
        fromEmail: currentUser?.email || "",
        careId: currentUser?.careId || "",
        status: "open",
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Couldn't send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>{config.title}</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        {sent ? (
          <div style={{
            background: "#E4F3EA", borderRadius: 16, padding: 24, textAlign: "center", marginTop: 30
          }}>
            <CheckCircle2 size={40} color={GREEN} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>Thanks — got it!</div>
            <div style={{ fontSize: 12.5, color: "#6b6d66", marginBottom: 18 }}>
              Your message has been recorded. We'll follow up if needed.
            </div>
            <button onClick={() => navigate("/profile/help")} style={{
              background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer"
            }}>
              Back to Help & Support
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: config.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon size={19} color={config.fg} />
              </div>
              <div style={{ fontSize: 12.5, color: "#6b6d66" }}>{config.intro}</div>
            </div>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={config.placeholder}
              rows={6}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ECEDE8",
                fontSize: 13.5, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit",
                background: "#fff", color: "#1A1A1A"
              }}
            />

            {error && <div style={{ color: "#E0435A", fontSize: 12, marginTop: 8 }}>{error}</div>}

            <button onClick={handleSubmit} disabled={sending} style={{
              width: "100%", background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 12,
              padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer",
              marginTop: 14, opacity: sending ? 0.7 : 1
            }}>
              {sending ? "Sending..." : "Send"}
            </button>

            <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 12, textAlign: "center" }}>
              Sent as {currentUser?.name} ({currentUser?.careId})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
