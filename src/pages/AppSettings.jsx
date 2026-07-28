import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ArrowLeft, Globe, Sun, Moon, Monitor, Type, Coins, Calendar, Clock, Trash2, CheckCircle2,
} from "lucide-react";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN } from "../constants/colors";

const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "bn", label: "বাংলা" },
];
const THEMES = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];
const FONT_SIZES = [
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
  { key: "xlarge", label: "Extra Large" },
];
const CURRENCIES = [
  { key: "BDT", label: "৳ Taka (BDT)" },
  { key: "USD", label: "$ Dollar (USD)" },
  { key: "EUR", label: "€ Euro (EUR)" },
  { key: "GBP", label: "£ Pound (GBP)" },
];
const DATE_FORMATS = [
  { key: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { key: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { key: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];
const TIME_FORMATS = [
  { key: "12h", label: "12-hour (2:30 PM)" },
  { key: "24h", label: "24-hour (14:30)" },
];

const DEFAULTS = {
  language: "en",
  theme: "system",
  fontSize: "medium",
  currency: "BDT",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
};

function SectionCard({ icon: Icon, fg, bg, title, note, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Icon size={16} color={fg} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{title}</div>
      </div>
      {children}
      {note && <div style={{ fontSize: 10.5, color: "#8B8D86", marginTop: 10, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => {
        const selected = value === o.key;
        const Icon = o.icon;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} style={{
            display: "flex", alignItems: "center", gap: 6,
            border: selected ? "none" : "1px solid #ECEDE8",
            background: selected ? GREEN : "#fff",
            color: selected ? "#fff" : "#1A1A1A",
            borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer"
          }}>
            {Icon && <Icon size={13} />} {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AppSettingsPage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [savedNote, setSavedNote] = useState("");
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (data.appSettings) setSettings({ ...DEFAULTS, ...data.appSettings });
      } catch (err) {
        console.error("Failed to load app settings:", err);
      }
      setLoading(false);
    })();
  }, [currentUser]);

  const updateSetting = async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { appSettings: next });
      setSavedNote("Saved");
      setTimeout(() => setSavedNote(""), 1200);
    } catch (err) {
      console.error("Failed to save app settings:", err);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      if (currentUser?.refreshProfile) await currentUser.refreshProfile();
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      setSavedNote("Cache cleared and data refreshed");
      setTimeout(() => setSavedNote(""), 2000);
    } finally {
      setClearingCache(false);
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
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>App Settings</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        {loading ? (
          <div style={{ fontSize: 12.5, color: "#8B8D86", textAlign: "center", padding: "30px 0" }}>Loading...</div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <SectionCard
              icon={Globe} fg="#2F6FE0" bg="#E5EFFC" title="Language"
              note="Saved for real, but the app's text isn't translated yet — that needs a separate translation system built for every screen."
            >
              <ChipGroup options={LANGUAGES} value={settings.language} onChange={v => updateSetting("language", v)} />
            </SectionCard>

            <SectionCard
              icon={Sun} fg="#E08A20" bg="#FDF0DF" title="Theme"
              note="Saved for real, but Dark Mode itself isn't built yet — every screen currently uses fixed light colors, and a proper dark theme needs its own design pass."
            >
              <ChipGroup options={THEMES} value={settings.theme} onChange={v => updateSetting("theme", v)} />
            </SectionCard>

            <SectionCard
              icon={Type} fg="#6E4FD1" bg="#EFEAFB" title="Font Size"
              note="Saved for real, but not yet applied — the app's text uses fixed sizes rather than scalable ones, so this needs a broader update to take visual effect."
            >
              <ChipGroup options={FONT_SIZES} value={settings.fontSize} onChange={v => updateSetting("fontSize", v)} />
            </SectionCard>

            <SectionCard
              icon={Coins} fg="#1F8A5A" bg="#E4F3EA" title="Currency"
              note="Saved for real, but Finance, Hostel Rent, and Travel still show Taka directly — reading this setting everywhere is a follow-up step."
            >
              <ChipGroup options={CURRENCIES} value={settings.currency} onChange={v => updateSetting("currency", v)} />
            </SectionCard>

            <SectionCard
              icon={Calendar} fg="#E0435A" bg="#FCE9EB" title="Date Format"
              note="Saved for real, not yet applied to dates shown elsewhere in the app."
            >
              <ChipGroup options={DATE_FORMATS} value={settings.dateFormat} onChange={v => updateSetting("dateFormat", v)} />
            </SectionCard>

            <SectionCard
              icon={Clock} fg="#2F6FE0" bg="#E5EFFC" title="Time Format"
              note="Saved for real, not yet applied to times shown elsewhere in the app."
            >
              <ChipGroup options={TIME_FORMATS} value={settings.timeFormat} onChange={v => updateSetting("timeFormat", v)} />
            </SectionCard>

            <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <button onClick={handleClearCache} disabled={clearingCache} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none",
                border: "none", cursor: "pointer", padding: 0, textAlign: "left", opacity: clearingCache ? 0.7 : 1
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: "#FCE9EB",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Trash2 size={16} color="#E0435A" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>
                    {clearingCache ? "Clearing..." : "Clear Cache"}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86", marginTop: 2 }}>
                    Clears any stored browser cache and refetches your latest data
                  </div>
                </div>
              </button>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 11.5,
              color: savedNote ? GREEN : "transparent", minHeight: 18, justifyContent: "center"
            }}>
              <CheckCircle2 size={13} /> {savedNote || "placeholder"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
