import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, HelpCircle, MessageSquare, Bug, Lightbulb, FileText, Shield, Info, ChevronRight, Rocket,
} from "lucide-react";

const APP_VERSION = "1.0.0";

export default function HelpSupportPage() {
  const navigate = useNavigate();

  const items = [
    { key: "faq", name: "FAQ", icon: HelpCircle, fg: "#1F8A5A", bg: "#E4F3EA", onClick: () => navigate("/profile/help/faq") },
    { key: "contact", name: "Contact Support", icon: MessageSquare, fg: "#2F6FE0", bg: "#E5EFFC", onClick: () => navigate("/profile/help/feedback/contact") },
    { key: "bug", name: "Report a Bug", icon: Bug, fg: "#E0435A", bg: "#FCE9EB", onClick: () => navigate("/profile/help/feedback/bug") },
    { key: "feature", name: "Suggest a Feature", icon: Lightbulb, fg: "#E08A20", bg: "#FDF0DF", onClick: () => navigate("/profile/help/feedback/feature") },
    { key: "terms", name: "Terms & Conditions", icon: FileText, fg: "#6E4FD1", bg: "#EFEAFB", onClick: () => navigate("/profile/help/legal/terms") },
    { key: "privacy", name: "Privacy Policy", icon: Shield, fg: "#6E4FD1", bg: "#EFEAFB", onClick: () => navigate("/profile/help/legal/privacy") },
    { key: "about", name: "About My Care", icon: Rocket, fg: "#1F8A5A", bg: "#E4F3EA", onClick: () => navigate("/profile/help/legal/about") },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Help & Support</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginTop: 10 }}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={item.onClick} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                borderBottom: i < items.length - 1 ? "1px solid #F0F1EC" : "none",
                background: "none", border: "none", cursor: "pointer", textAlign: "left"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={item.fg} />
                </div>
                <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{item.name}</span>
                <ChevronRight size={16} color="#c7c8c2" />
              </button>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          marginTop: 16, fontSize: 11.5, color: "#8B8D86"
        }}>
          <Info size={13} /> My Care App Version {APP_VERSION}
        </div>
      </div>
    </div>
  );
}
