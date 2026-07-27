import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ArrowLeft, Bell, Landmark, Utensils, Banknote, GraduationCap, Briefcase,
  Rocket, BookOpen, Sparkles, Megaphone,
} from "lucide-react";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN } from "../constants/colors";

const NOTIFICATION_ITEMS = [
  { key: "general", label: "General Notifications", icon: Bell, fg: "#1F8A5A", bg: "#E4F3EA" },
  { key: "prayer", label: "Prayer Reminders", icon: Landmark, fg: "#6E4FD1", bg: "#EFEAFB" },
  { key: "meals", label: "Meal Reminders", icon: Utensils, fg: "#E08A20", bg: "#FDF0DF" },
  { key: "rent", label: "Rent Reminders", icon: Banknote, fg: "#1F8A5A", bg: "#E4F3EA" },
  { key: "school", label: "School Notifications", icon: GraduationCap, fg: "#2F6FE0", bg: "#E5EFFC" },
  { key: "travel", label: "Travel Notifications", icon: Briefcase, fg: "#1CA6C2", bg: "#E3F4F8" },
  { key: "career", label: "Career Hub Notifications", icon: Rocket, fg: "#1F8A5A", bg: "#E4F3EA" },
  { key: "bookUpdates", label: "Book Updates", icon: BookOpen, fg: "#E0435A", bg: "#FCE9EB" },
  { key: "aiSuggestions", label: "AI Suggestions", icon: Sparkles, fg: "#6E4FD1", bg: "#EFEAFB" },
  { key: "marketing", label: "Marketing Notifications", icon: Megaphone, fg: "#8B8D86", bg: "#F0F1EC" },
];

const DEFAULT_SETTINGS = {
  general: true, prayer: true, meals: true, rent: true, school: true,
  travel: true, career: true, bookUpdates: true, aiSuggestions: true, marketing: false,
};

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
        background: on ? GREEN : "#e2e3dd", position: "relative", flexShrink: 0, transition: "background 0.15s"
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 0.15s"
      }} />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (data.notificationSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.notificationSettings });
        }
      } catch (err) {
        console.error("Failed to load notification settings:", err);
      }
      setLoading(false);
    })();
  }, [currentUser]);

  const saveSettings = async (next) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { notificationSettings: next });
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleOne = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveSettings(next);
  };

  const setAll = (value) => {
    const next = {};
    NOTIFICATION_ITEMS.forEach(item => { next[item.key] = value; });
    setSettings(next);
    saveSettings(next);
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
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Notification Settings</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        <div style={{ display: "flex", gap: 8, margin: "10px 0 16px" }}>
          <button onClick={() => setAll(true)} style={{
            flex: 1, background: "#E4F3EA", color: GREEN, border: "none", borderRadius: 10,
            padding: "10px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer"
          }}>Enable All</button>
          <button onClick={() => setAll(false)} style={{
            flex: 1, background: "#FCE9EB", color: "#E0435A", border: "none", borderRadius: 10,
            padding: "10px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer"
          }}>Disable All</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#8B8D86", fontSize: 13, padding: "30px 0" }}>Loading...</div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
            {NOTIFICATION_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.key} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                  borderBottom: i < NOTIFICATION_ITEMS.length - 1 ? "1px solid #F0F1EC" : "none"
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, background: item.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon size={16} color={item.fg} />
                  </div>
                  <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{item.label}</span>
                  <ToggleSwitch on={!!settings[item.key]} onChange={() => toggleOne(item.key)} />
                </div>
              );
            })}
          </div>
        )}

        <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 12, textAlign: "center" }}>
          {saving ? "Saving..." : "Your preferences are saved automatically."}
        </div>
      </div>
    </div>
  );
}
