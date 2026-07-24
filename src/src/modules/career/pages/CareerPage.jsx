import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Bot, FileText, PenSquare, UserSquare2, Image as ImageIcon, FileType2, Mic,
  ArrowRight, Download, MoreHorizontal, Crown, ChevronRight, Sparkles,
} from "lucide-react";
import { useCurrentUser } from "../../../contexts/CurrentUserContext";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";

const tools = [
  { key: "cv", name: "AI CV Builder", sub: "Create professional CV in 1 minute", icon: FileText, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "app", name: "AI Application Writer", sub: "Write any application instantly with AI", icon: PenSquare, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "passport", name: "Passport Photo Maker", sub: "Create passport size photo in seconds", icon: UserSquare2, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "resize", name: "Photo Resizer Tool", sub: "Resize photo in KB or dimension", icon: ImageIcon, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "pdf", name: "PDF Tools", sub: "Merge, Split, Compress & Convert PDF", icon: FileType2, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "interview", name: "AI Interview Practice", sub: "Practice interview & get better", icon: Mic, bg: "#E3F4F8", fg: "#1CA6C2" },
];

const stats = [
  { key: "cv", value: "12", label: "CV Created", icon: FileText, fg: "#1F8A5A" },
  { key: "apps", value: "8", label: "Applications", icon: PenSquare, fg: "#2F6FE0" },
  { key: "photos", value: "25", label: "Photos Edited", icon: ImageIcon, fg: "#6E4FD1" },
  { key: "pdf", value: "15", label: "PDF Files", icon: FileType2, fg: "#E0435A" },
  { key: "satisfaction", value: "100%", label: "Satisfaction", icon: Sparkles, fg: "#1F8A5A" },
];

const recentFiles = [
  { key: "cvfile", name: "Software Engineer CV.pdf", meta: "Created Today, 08:45 AM · 245 KB", tag: "CV", tagBg: "#E4F3EA", tagFg: "#1F8A5A", iconBg: "#E4F3EA", iconFg: "#1F8A5A" },
  { key: "appfile", name: "Application for Leave.pdf", meta: "Created Today, 08:20 AM · 125 KB", tag: "Application", tagBg: "#E5EFFC", tagFg: "#2F6FE0", iconBg: "#E5EFFC", iconFg: "#2F6FE0" },
  { key: "photofile", name: "Passport Photo (4 Copies)", meta: "Created Yesterday, 10:30 PM · 2.4 MB", tag: "Photo", tagBg: "#EFEAFB", tagFg: "#6E4FD1", iconBg: "#EFEAFB", iconFg: "#6E4FD1" },
];

export default function CareerPage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff",
            border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <ChevronRight size={16} color="#1A1A1A" style={{ transform: "rotate(180deg)" }} />
          </button>
          <CareLogo size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Career Hub</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Build your future. We make it easy.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }}>
            <span style={{ fontWeight: 700, fontSize: 12.5, color: GREEN }}>{currentUser?.initials || "NA"}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 0" }}>
          <CareIdBadge compact />
        </div>
        {/* Smart Career Tools banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "22px 20px",
          background: "linear-gradient(135deg,#1F8A5A,#22B573)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", maxWidth: 220 }}>Smart Career Tools</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", marginTop: 6, maxWidth: 200 }}>
            AI Powered · Fast · Easy
          </div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", maxWidth: 190, lineHeight: 1.5 }}>
            Create professional documents within a minute.
          </div>
          <button style={{
            marginTop: 14, background: "#fff", border: "none", color: GREEN_DARK,
            borderRadius: 999, padding: "9px 8px 9px 16px", fontSize: 12.5, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
          }}>
            How it works
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: GREEN,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <ArrowRight size={12} color="#fff" />
            </span>
          </button>
          <Bot size={64} color="#fff" style={{ position: "absolute", right: 18, bottom: 14, opacity: 0.9 }} />
          <Sparkles size={16} color="#fff" style={{ position: "absolute", right: 90, top: 20, opacity: 0.8 }} />
        </div>

        {/* Tools grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <div key={t.key} style={{ background: t.bg, borderRadius: 16, padding: 14, position: "relative" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Icon size={20} color={t.fg} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: t.fg, lineHeight: 1.3, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 10.5, color: "#6b6d66", lineHeight: 1.4, marginBottom: 22 }}>{t.sub}</div>
                <button style={{
                  position: "absolute", bottom: 12, right: 12, width: 26, height: 26, borderRadius: "50%",
                  background: t.fg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                }}>
                  <ArrowRight size={13} color="#fff" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8",
          borderRadius: 16, padding: "16px 8px", marginTop: 16
        }}>
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ textAlign: "center", flex: 1 }}>
                <Icon size={17} color={s.fg} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#8B8D86" }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recently Created */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recently Created</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
            View All <ChevronRight size={14} />
          </span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {recentFiles.map((f, i) => (
            <div key={f.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < recentFiles.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: f.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <FileText size={17} color={f.iconFg} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{f.meta}</div>
              </div>
              <span style={{
                background: f.tagBg, color: f.tagFg, fontSize: 10.5, fontWeight: 600,
                borderRadius: 999, padding: "3px 10px", flexShrink: 0
              }}>{f.tag}</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Download size={16} color="#1A1A1A" />
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <MoreHorizontal size={16} color="#8B8D86" />
              </button>
            </div>
          ))}
        </div>

        {/* Go Premium */}
        <div style={{
          margin: "16px 0 20px", borderRadius: 16, padding: "16px 18px",
          background: "#EAF6EF", display: "flex", alignItems: "center", gap: 12
        }}>
          <Crown size={26} color="#E8A93B" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>Go Premium</div>
            <div style={{ fontSize: 11.5, color: "#6b6d66", lineHeight: 1.4 }}>
              Unlock all premium templates, AI cover letter, unlimited downloads & more.
            </div>
          </div>
          <button style={{
            background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 10,
            padding: "9px 12px", fontSize: 12, fontWeight: 600, display: "flex",
            alignItems: "center", gap: 4, whiteSpace: "nowrap", cursor: "pointer"
          }}>
            Upgrade <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
