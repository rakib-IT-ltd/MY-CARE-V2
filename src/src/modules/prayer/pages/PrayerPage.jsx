import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Calendar, CheckCircle2, ChevronDown, Landmark, Menu, Pencil, Plus, XCircle,
  Clock, BarChart3, Trophy, Target, Sunrise, Sun, Sunset, Moon,
  Home as HomeIcon, CheckSquare, User,
} from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { GREEN, GREEN_DARK, FIN_GREEN, FIN_BLUE, FIN_ORANGE, FIN_PURPLE, FIN_RED } from "../../../constants/colors";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";

const prayerOverview = [
  { key: "prayed", icon: CheckCircle2, bg: "#E4F3EA", fg: FIN_GREEN, value: "3", label: "Prayed", sub: "times" },
  { key: "missed", icon: Clock, bg: "#FDF0DF", fg: FIN_ORANGE, value: "2", label: "Missed", sub: "times" },
  { key: "total", icon: Calendar, bg: "#E5EFFC", fg: FIN_BLUE, value: "15", label: "Total Prayers", sub: "times" },
  { key: "accuracy", icon: Target, bg: "#EFEAFB", fg: FIN_PURPLE, value: "60%", label: "Accuracy", sub: "this day" },
];

const yesterdayPrayers = [
  { key: "fajr", name: "Fajr", arabic: "الفجر", time: "4:15 AM", status: "Prayed", icon: Sunrise, bg: "#1F8A5A" },
  { key: "sunrise", name: "Sunrise", arabic: "الشروق", time: "5:34 AM", status: "Missed", icon: Sun, bg: "#E08A20" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر", time: "1:15 PM", status: "Prayed", icon: Sun, bg: "#1F8A5A" },
  { key: "asr", name: "Asr", arabic: "العصر", time: "4:45 PM", status: "Prayed", icon: Sun, bg: "#E08A20" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب", time: "6:55 PM", status: "Missed", icon: Sunset, bg: "#E0435A" },
  { key: "isha", name: "Isha", arabic: "العشاء", time: "8:25 PM", status: "Prayed", icon: Moon, bg: "#1A2B4C" },
];

const weeklyProgress = [
  { key: "mon", day: "Mon", date: "12", ratio: "5/5", pct: 100, color: FIN_GREEN },
  { key: "tue", day: "Tue", date: "13", ratio: "3/5", pct: 60, color: FIN_ORANGE },
  { key: "wed", day: "Wed", date: "14", ratio: "4/5", pct: 80, color: FIN_GREEN },
  { key: "thu", day: "Thu", date: "15", ratio: "2/5", pct: 40, color: FIN_RED },
  { key: "fri", day: "Fri", date: "16", ratio: "5/5", pct: 100, color: FIN_GREEN },
  { key: "sat", day: "Sat", date: "17", ratio: "3/5", pct: 60, color: FIN_ORANGE },
  { key: "sun", day: "Sun", date: "18", ratio: "3/5", pct: 60, color: FIN_ORANGE, active: true },
];

const monthlyBars = [
  8, 62, 40, 35, 92, 30, 20, 55, 60, 45,
  50, 65, 70, 58, 40, 68, 72, 55, 48, 30,
  38, 62, 58, 42, 66, 5, 40, 55, 60, 35,
].map((v, i) => ({ day: i + 1, pct: v }));

const yearlySummary = [
  { key: "total", label: "Total Days", value: "140", color: "#1A1A1A" },
  { key: "completed", label: "Days Completed", value: "98", color: FIN_GREEN },
  { key: "missed", label: "Days Missed", value: "42", color: FIN_RED },
  { key: "accuracy", label: "Yearly Accuracy", value: "70%", color: FIN_GREEN },
];

const prayerTabs = [
  { key: "today", name: "Today", icon: Calendar },
  { key: "history", name: "History", icon: Clock },
  { key: "stats", name: "Stats", icon: BarChart3 },
  { key: "goals", name: "Goals", icon: Trophy },
  { key: "calendar", name: "Calendar", icon: Calendar },
];

const prayerBottomTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "daily-task", name: "Daily Task", icon: CheckSquare },
  { key: "prayer", name: "Prayer", icon: Landmark },
  { key: "profile", name: "Profile", icon: User },
];

function DayRing({ d }) {
  const r = 24, c = 2 * Math.PI * r;
  const offset = c - (d.pct / 100) * c;
  return (
    <div style={{
      textAlign: "center", padding: "10px 4px", borderRadius: 12,
      background: d.active ? "#E4F3EA" : "transparent"
    }}>
      <div style={{ fontSize: 11, color: "#8B8D86", marginBottom: 2 }}>{d.day}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>{d.date}</div>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#F0F1EC" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none" stroke={d.color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
        <text x="28" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">{d.ratio}</text>
      </svg>
    </div>
  );
}

function PrayerHistoryTab() {
  return (
    <div>
      {/* Prayer Overview */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", marginBottom: 12 }}>Prayer Overview</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {prayerOverview.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ background: s.bg, borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1A1A1A", marginBottom: 6 }}>
                  <Icon size={14} color={s.fg} /> {s.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: "#6b6d66" }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yesterday */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Yesterday (19 May 2025)</span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}>
          Edit <Pencil size={12} />
        </span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {yesterdayPrayers.map((p, i) => (
          <div key={p.key} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < yesterdayPrayers.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: p.bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <p.icon size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                {p.name} <span style={{ fontWeight: 400, color: "#6b6d66" }}>{p.arabic}</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#8B8D86", width: 70 }}>{p.time}</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600,
              color: p.status === "Prayed" ? FIN_GREEN : FIN_RED
            }}>
              {p.status === "Prayed" ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {p.status}
            </div>
          </div>
        ))}
        <button style={{
          width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
          padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", margin: "12px 0 8px"
        }}>
          <Plus size={15} /> Add / Edit Day
        </button>
      </div>

      {/* Your Progress */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Your Progress</span>
          <span style={{
            fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
          }}>This Week <ChevronDown size={12} /></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {weeklyProgress.map(d => <DayRing key={d.key} d={d} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_GREEN, display: "inline-block" }} /> Prayed
            </span>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_ORANGE, display: "inline-block" }} /> Partial
            </span>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_RED, display: "inline-block" }} /> Missed
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#1A1A1A" }}>Weekly Accuracy: <b style={{ color: FIN_GREEN }}>71%</b></span>
        </div>
      </div>

      {/* Monthly Overview */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Monthly Overview</span>
          <span style={{
            fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
          }}>May 2025 <ChevronDown size={12} /></span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 108 }}>
            {[
              { label: "Total Days", value: "19", color: "#1A1A1A" },
              { label: "Days Completed", value: "13", color: FIN_GREEN },
              { label: "Days Missed", value: "6", color: FIN_RED },
              { label: "Monthly Accuracy", value: "68%", color: FIN_GREEN },
            ].map(r => (
              <div key={r.label}>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{r.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: r.color }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBars} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8B8D86" }} axisLine={false} tickLine={false}
                  ticks={[1, 5, 10, 15, 20, 25, 30]} />
                <YAxis tick={{ fontSize: 9, fill: "#8B8D86" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
                  {monthlyBars.map((b, i) => <Cell key={i} fill={FIN_GREEN} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Yearly Summary</span>
        <span style={{
          fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
          borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
        }}>Year 2025 <ChevronDown size={12} /></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {yearlySummary.map(y => (
          <div key={y.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 4 }}>{y.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: y.color }}>{y.value}</div>
          </div>
        ))}
      </div>

      {/* Quote banner */}
      <div style={{
        background: "#EAF6EF", borderRadius: 14, padding: 14, marginTop: 16,
        display: "flex", alignItems: "flex-start", gap: 12
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Landmark size={17} color={GREEN} />
        </div>
        <div style={{ fontSize: 12.5, color: "#1A1A1A", lineHeight: 1.6 }}>
          <b>Stay consistent, for the sake of Allah.</b><br />
          <span style={{ color: "#6b6d66" }}>"Indeed, prayer prohibits immorality and wrongdoing." – Quran 29:45</span>
        </div>
      </div>
    </div>
  );
}

function PrayerComingSoon({ label }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 30, textAlign: "center", color: "#8B8D86" }}>
      <Landmark size={30} color="#c7c8c2" style={{ marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
      <div style={{ fontSize: 12.5, marginTop: 4 }}>This view is coming next — let me know if you'd like it built out.</div>
    </div>
  );
}

export default function PrayerPage() {
  const navigate = useNavigate();
  const [activePrayerTab, setActivePrayerTab] = useState("history");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Prayer</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Track your prayers. Grow your faith.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 0" }}>
          <CareIdBadge compact />
        </div>
        {/* Prayer tabs */}
        <div style={{ display: "flex", gap: 18, overflowX: "auto", borderBottom: "1px solid #ECEDE8", margin: "6px 0 16px", paddingBottom: 2 }}>
          {prayerTabs.map(t => {
            const Icon = t.icon;
            const active = activePrayerTab === t.key;
            return (
              <button key={t.key} onClick={() => setActivePrayerTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 5, paddingBottom: 8,
                borderBottom: active ? `2px solid ${GREEN}` : "2px solid transparent",
                color: active ? GREEN : "#8B8D86", fontWeight: 600, fontSize: 12.5
              }}>
                <Icon size={14} /> {t.name}
              </button>
            );
          })}
        </div>

        {activePrayerTab === "history" && <PrayerHistoryTab />}
        {activePrayerTab === "today" && <PrayerComingSoon label="Today's Prayers" />}
        {activePrayerTab === "stats" && <PrayerComingSoon label="Stats" />}
        {activePrayerTab === "goals" && <PrayerComingSoon label="Goals" />}
        {activePrayerTab === "calendar" && <PrayerComingSoon label="Calendar" />}

        {/* Bottom-style local nav (mirrors reference image) */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {prayerBottomTabs.map(t => {
            const Icon = t.icon;
            const active = t.key === "prayer";
            return (
              <button key={t.key} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? GREEN : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? GREEN : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

