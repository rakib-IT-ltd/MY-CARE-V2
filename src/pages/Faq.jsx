import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { GREEN } from "../constants/colors";

const FAQS = [
  {
    q: "What is my CARE ID and where do I find it?",
    a: "Your CARE ID is a unique code (like CARE-48291-RH) tied permanently to your account. You'll find it on your Profile page and at the top of every section. It's how other people connect with you across Hostel, Family, Travel, School, and every other part of My Care.",
  },
  {
    q: "How do I connect with someone using their CARE ID?",
    a: "Look for an \"Add\" or \"Invite\" option in the relevant section (like Family Tree or Travel members). Enter their CARE ID, and if it matches a real account, you'll see their name to confirm before sending a request. They'll get an Accept/Decline prompt — you're only connected once they accept.",
  },
  {
    q: "I'm a Hostel Manager — how do I add a student?",
    a: "Open Hostel, go to your Dashboard, and use \"Quick Entry.\" Enter the student's CARE ID, confirm their name, and send the invite. They'll see it as a pending request in their own Hostel section.",
  },
  {
    q: "Why can't I add a phone number or enable two-factor authentication yet?",
    a: "Those features need a paid Firebase plan with SMS support, which hasn't been set up yet. They'll become available once that upgrade happens.",
  },
  {
    q: "Do the Notification and App Settings toggles actually do anything?",
    a: "Your choices are saved for real to your account. Some (like Notification categories) don't yet trigger real alerts, since that needs a separate notification-delivery system. Others (like Theme and Language) are saved but not yet visually applied — those need bigger changes across every screen.",
  },
  {
    q: "Is my data private?",
    a: "Your account data is stored in your own Firebase project. You can review and manage some of this from Privacy & Security in your Profile, including downloading a copy of your data or deleting your account entirely.",
  },
  {
    q: "How do I report a bug or suggest a new feature?",
    a: "Go to Profile → Help & Support → Report a Bug or Suggest a Feature. Your message is saved and can be reviewed later.",
  },
];

export default function FaqPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>FAQ</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 10, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0
                  }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{item.q}</span>
                  <ChevronDown size={16} color="#8B8D86" style={{
                    flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s"
                  }} />
                </button>
                {open && (
                  <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.6, marginTop: 10 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
