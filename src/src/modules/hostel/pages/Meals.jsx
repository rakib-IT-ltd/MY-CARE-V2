import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  collection, doc, getDocs, setDoc, onSnapshot, query, orderBy, limit,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import { Utensils, SquarePen, CheckCircle2 } from "lucide-react";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import { todayKey, slugify } from "../../../utils/helpers";
import { MEAL_TYPES, MEAL_PRESET_ITEMS } from "../../../constants/meals";
import SectionTitle from "../../../components/SectionTitle";

export default function Meals() {
  const { hostelId } = useOutletContext();
  const [todayDoc, setTodayDoc] = useState(null);
  const [menuDraft, setMenuDraft] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [customItem, setCustomItem] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuSavedNote, setMenuSavedNote] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!hostelId) return;
    const unsub = onSnapshot(doc(db, "hostels", hostelId, "days", todayKey()), (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setTodayDoc(data);
      if (data.menu) setMenuDraft({
        breakfast: data.menu.breakfast || [],
        lunch: data.menu.lunch || [],
        dinner: data.menu.dinner || [],
      });
    });
    return () => unsub();
  }, [hostelId]);

  useEffect(() => {
    if (!hostelId) return;
    (async () => {
      setLoadingHistory(true);
      try {
        const q = query(collection(db, "hostels", hostelId, "days"), orderBy("date", "desc"), limit(8));
        const snap = await getDocs(q);
        const days = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(d => d.id !== todayKey());
        setHistory(days);
      } catch (err) {
        console.error("Failed to load meal history:", err);
      }
      setLoadingHistory(false);
    })();
  }, [hostelId, todayDoc]);

  const toggleMenuItem = (mealKey, item) => {
    setMenuDraft(prev => {
      const list = prev[mealKey];
      const exists = list.some(i => i.key === item.key);
      return {
        ...prev,
        [mealKey]: exists ? list.filter(i => i.key !== item.key) : [...list, item],
      };
    });
  };

  const addCustomItem = (mealKey) => {
    const text = customItem[mealKey].trim();
    if (!text) return;
    const item = { key: slugify(text), label: text };
    toggleMenuItem(mealKey, item);
    setCustomItem(prev => ({ ...prev, [mealKey]: "" }));
  };

  const handleSaveMenu = async () => {
    setSavingMenu(true);
    try {
      await setDoc(doc(db, "hostels", hostelId, "days", todayKey()), {
        menu: menuDraft,
        date: todayKey(),
      }, { merge: true });
      setMenuSavedNote("Today's menu saved — students can now choose their meals.");
      setTimeout(() => setMenuSavedNote(""), 3000);
    } finally {
      setSavingMenu(false);
    }
  };

  const tallyFor = (dayData) => {
    const tally = { breakfast: {}, lunch: {}, dinner: {} };
    const choicesMap = dayData?.choices || {};
    Object.values(choicesMap).forEach(choice => {
      MEAL_TYPES.forEach(({ key }) => {
        const picked = choice[key];
        if (picked) tally[key][picked] = (tally[key][picked] || 0) + 1;
      });
    });
    return tally;
  };

  const choiceTally = tallyFor(todayDoc);
  const totalRespondedStudents = Object.keys(todayDoc?.choices || {}).length;

  const formatSummaryLine = (tally, mealKey, menuForDay) => {
    const entries = Object.entries(tally[mealKey]);
    if (entries.length === 0) return "No responses";
    return entries.map(([key, count]) => {
      const label = MEAL_PRESET_ITEMS.find(p => p.key === key)?.label
        || (menuForDay?.[mealKey]?.find(i => i.key === key)?.label) || key;
      return `${label}-${count}`;
    }).join(", ");
  };

  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 18, color: GREEN, marginBottom: 2 }}>Meals</div>
      <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 14 }}>Set today's menu, see who chose what, and browse past days.</div>

      {/* Today's Meals Summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Utensils size={16} /> Today's Summary
        </span>
        <span style={{ fontSize: 11.5, color: "#8B8D86" }}>{totalRespondedStudents} responded</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {MEAL_TYPES.map(mt => {
          const Icon = mt.icon;
          const entries = Object.entries(choiceTally[mt.key]);
          const total = entries.reduce((sum, [, c]) => sum + c, 0);
          return (
            <div key={mt.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
              <Icon size={16} color={mt.fg} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{total}</div>
              <div style={{ fontSize: 10, color: "#8B8D86", marginBottom: 4 }}>{mt.label}</div>
              <div style={{ fontSize: 9.5, color: entries.length ? "#6b6d66" : "#c7c8c2", lineHeight: 1.4 }}>
                {formatSummaryLine(choiceTally, mt.key, menuDraft)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Menu For Today */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <SquarePen size={15} /> Submit Today's Menu
        </div>
        <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 12 }}>
          Rice & Dal are included with every meal automatically. Pick the main items students can choose from below.
        </div>
        {MEAL_TYPES.map((mt, i) => (
          <div key={mt.key} style={{ marginTop: i > 0 ? 16 : 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <mt.icon size={14} color={mt.fg} /> {mt.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {MEAL_PRESET_ITEMS.map(item => {
                const selected = menuDraft[mt.key].some(i => i.key === item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleMenuItem(mt.key, item)}
                    style={{
                      border: selected ? "none" : "1px solid #ECEDE8",
                      background: selected ? GREEN : "#fff",
                      color: selected ? "#fff" : "#1A1A1A",
                      borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
              {menuDraft[mt.key].filter(i => !MEAL_PRESET_ITEMS.some(p => p.key === i.key)).map(item => (
                <button
                  key={item.key}
                  onClick={() => toggleMenuItem(mt.key, item)}
                  style={{
                    border: "none", background: GREEN, color: "#fff",
                    borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  {item.label} ✕
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={customItem[mt.key]}
                onChange={e => setCustomItem(prev => ({ ...prev, [mt.key]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") addCustomItem(mt.key); }}
                placeholder="Other item (type and press Enter)"
                style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "7px 10px", fontSize: 12 }}
              />
              <button onClick={() => addCustomItem(mt.key)} style={{
                background: "#F0F1EC", border: "none", borderRadius: 8, padding: "7px 12px",
                fontSize: 12, fontWeight: 600, color: "#1A1A1A", cursor: "pointer"
              }}>Add</button>
            </div>
          </div>
        ))}
        <button onClick={handleSaveMenu} disabled={savingMenu} style={{
          width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
          padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 16, opacity: savingMenu ? 0.7 : 1
        }}>
          <CheckCircle2 size={15} /> {savingMenu ? "Saving..." : "Save Today's Menu"}
        </button>
        {menuSavedNote && (
          <div style={{ fontSize: 11.5, color: GREEN, marginTop: 8, textAlign: "center" }}>{menuSavedNote}</div>
        )}
      </div>

      {/* Meal History */}
      <SectionTitle>Meal History</SectionTitle>
      {loadingHistory ? (
        <div style={{ fontSize: 12, color: "#8B8D86", padding: "10px 0" }}>Loading...</div>
      ) : history.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          fontSize: 12.5, color: "#6b6d66", marginBottom: 16
        }}>
          No past days yet — history will appear here once you've saved menus on previous days.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {history.map(day => {
            const tally = tallyFor(day);
            const responded = Object.keys(day.choices || {}).length;
            return (
              <div key={day.id} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{day.id}</span>
                  <span style={{ fontSize: 11, color: "#8B8D86" }}>{responded} responded</span>
                </div>
                {MEAL_TYPES.map(mt => (
                  <div key={mt.key} style={{ fontSize: 11.5, color: "#6b6d66", marginTop: 2 }}>
                    <b style={{ color: "#1A1A1A" }}>{mt.label}:</b> {formatSummaryLine(tally, mt.key, day.menu)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

