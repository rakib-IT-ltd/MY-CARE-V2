import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bell, ChevronDown, ChevronRight, Droplet, Footprints, GlassWater,
  HeartPulse, Lightbulb, Moon, MoreHorizontal, Pill, Plus, Scale, Stethoscope, Thermometer,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { GREEN } from "../../../constants/colors";
import CareLogo from "../../../components/carelogo";
import CareIdBadge from "../../../components/careIdbadge";

const vitals = [
  { key: "hr", name: "Heart Rate", value: "72", unit: "bpm", status: "Normal", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "sugar", name: "Blood Sugar", value: "5.6", unit: "mmol/L", status: "Normal", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "bp", name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "weight", name: "Weight", value: "68.5", unit: "kg", status: "Healthy", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
];

const addReadings = [
  { key: "bp", name: "Blood Pressure", sub: "Track your BP", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "sugar", name: "Blood Sugar", sub: "Track your sugar level", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "weight", name: "Weight", sub: "Track your weight", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hr", name: "Heart Rate", sub: "Track your heart rate", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "spo2", name: "SpO2", sub: "Track your oxygen level", icon: Droplet, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "temp", name: "Body Temperature", sub: "Track your temperature", icon: Thermometer, bg: "#FDF0DF", fg: "#E08A20" },
];

const heartRateData = [
  { day: "Mon", bpm: 74 }, { day: "Tue", bpm: 78 }, { day: "Wed", bpm: 70 },
  { day: "Thu", bpm: 72 }, { day: "Fri", bpm: 76 }, { day: "Sat", bpm: 71 }, { day: "Sun", bpm: 79 },
];

const recentReadings = [
  { key: "bp", name: "Blood Pressure", value: "120/80 mmHg", meta: "Today, 8:30 AM", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "sugar", name: "Blood Sugar", value: "5.6 mmol/L", meta: "Today, 8:20 AM", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "weight", name: "Weight", value: "68.5 kg", meta: "Yesterday, 7:45 AM", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hr", name: "Heart Rate", value: "72 bpm", meta: "Yesterday, 7:40 AM", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
];

const initialReminders = [
  { key: "med", name: "Medicine", sub: "Vitamin D – 1 tablet · Today, 9:00 AM", icon: Pill, bg: "#FCE9EB", fg: "#E0435A", on: true },
  { key: "water", name: "Drink Water", sub: "Next reminder at 11:00 AM", icon: GlassWater, bg: "#E5EFFC", fg: "#2F6FE0", on: true },
  { key: "walk", name: "Morning Walk", sub: "Daily goal: 30 minutes", icon: Footprints, bg: "#E4F3EA", fg: "#1F8A5A", on: false },
];

function ProgressCard({ icon: Icon, iconBg, iconFg, cardBg, title, value, unit, goal, pct, barColor }) {
  return (
    <div style={{ background: cardBg, borderRadius: 14, padding: 14, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Icon size={14} color={iconFg} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{title}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>
        {value} <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6d66" }}>{unit}</span>
      </div>
      <div style={{ background: "#ffffffaa", borderRadius: 999, height: 5, margin: "8px 0 6px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 10.5, color: "#6b6d66" }}>{goal}</div>
    </div>
  );
}


export default function HealthPage() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminder = (key) => {
    setReminders(rs => rs.map(r => r.key === key ? { ...r, on: !r.on } : r));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Health</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Track your health, live better</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={17} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -5, right: -5, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MoreHorizontal size={18} color="#1A1A1A" />
          </div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Greeting banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "20px 20px",
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6, maxWidth: 220 }}>
            Good Morning, Rakib! ☀️
          </div>
          <div style={{ fontSize: 12.5, color: "#5b5d56", marginTop: 6, maxWidth: 220, lineHeight: 1.5 }}>
            Take care of your body. It's the only place you have to live.
          </div>
          <button style={{
            marginTop: 12, background: "#fff", border: "1px solid #d6e9dc", color: GREEN,
            borderRadius: 999, padding: "7px 14px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            Health Tips <Lightbulb size={13} />
          </button>
          <HeartPulse size={70} color="#E0435A" style={{ position: "absolute", right: 14, top: 22, opacity: 0.9 }} />
        </div>

        {/* Vitals grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {vitals.map(v => {
            const Icon = v.icon;
            return (
              <div key={v.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: v.bg,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={15} color={v.fg} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{v.name}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>
                  {v.value} <span style={{ fontSize: 12, fontWeight: 500, color: v.fg }}>{v.unit}</span>
                </div>
                <span style={{
                  display: "inline-block", marginTop: 8, background: v.bg, color: v.fg,
                  fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 10px"
                }}>{v.status}</span>
              </div>
            );
          })}
        </div>

        {/* Add New Reading */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Add New Reading</span>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={14} color={GREEN} />
            </div>
          </div>
          {addReadings.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={17} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.sub}</div>
                </div>
                <ChevronRight size={16} color="#c7c8c2" />
              </div>
            );
          })}
        </div>

        {/* Health Overview */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Health Overview</span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
              borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
            }}>7 Days <ChevronDown size={12} /></span>
          </div>
          <div style={{ display: "flex", gap: 18, borderBottom: "2px solid #F0F1EC", marginBottom: 14 }}>
            {[HeartPulse, Droplet, Stethoscope, Scale].map((Icon, i) => (
              <div key={i} style={{
                paddingBottom: 8, borderBottom: i === 0 ? "2px solid #E0435A" : "2px solid transparent", marginBottom: -2
              }}>
                <Icon size={17} color={i === 0 ? "#E0435A" : "#c7c8c2"} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Heart Rate (bpm)</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#E0435A" }}>72 bpm</span>
          </div>
          <div style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} bpm`, "Heart rate"]} />
                <Line type="monotone" dataKey="bpm" stroke="#E0435A" strokeWidth={2.5} dot={{ r: 4, fill: "#E0435A" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            background: "#FCE9EB", borderRadius: 12, padding: 12, marginTop: 8,
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartPulse size={15} color="#E0435A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Your average heart rate</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>72 bpm</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Normal range</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>60 - 100 bpm</div>
            </div>
          </div>
        </div>

        {/* Steps / Water / Sleep */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <ProgressCard icon={Footprints} iconBg="#fff" iconFg="#1F8A5A" cardBg="#EAF6EF"
            title="Steps" value="6,245" unit="steps" goal="Goal: 10,000 steps" pct={62} barColor="#1F8A5A" />
          <ProgressCard icon={GlassWater} iconBg="#fff" iconFg="#2F6FE0" cardBg="#EAF1FC"
            title="Water Intake" value="6" unit="glasses" goal="Goal: 8 glasses" pct={75} barColor="#2F6FE0" />
          <ProgressCard icon={Moon} iconBg="#fff" iconFg="#6E4FD1" cardBg="#EFEAFB"
            title="Sleep" value="7h 30m" unit="" goal="Goal: 8 hours" pct={94} barColor="#6E4FD1" />
        </div>

        {/* Recent Readings */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Readings</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {recentReadings.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < recentReadings.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.meta}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{r.value}</div>
              </div>
            );
          })}
        </div>

        {/* Reminders */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Reminders</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {reminders.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < reminders.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.sub}</div>
                </div>
                <button
                  onClick={() => toggleReminder(r.key)}
                  style={{
                    width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer",
                    background: r.on ? GREEN : "#e2e3dd", position: "relative", flexShrink: 0
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: r.on ? 19 : 3, transition: "left 0.15s"
                  }} />
                </button>
              </div>
            );
          })}
          <button style={{
            width: "100%", background: "none", border: "none", color: GREEN, fontWeight: 600,
            fontSize: 13.5, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
          }}>
            <Plus size={15} /> Add New Reminder
          </button>
        </div>
      </div>
    </div>
  );
}

