import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { collection, getDocs, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import { FileText } from "lucide-react";
import { GREEN, GREEN_DARK } from "../../../constants/colors";
import { todayKey } from "../../../utils/helpers";
import {
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const { hostelId, students, hostelInfo } = useOutletContext();
  const [mealTrend, setMealTrend] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!hostelId) return;
    (async () => {
      setLoadingTrend(true);
      try {
        const q = query(collection(db, "hostels", hostelId, "days"), orderBy("date", "desc"), limit(7));
        const snap = await getDocs(q);
        const days = snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse();
        setMealTrend(days.map(d => ({
          date: d.id.slice(5),
          responses: Object.keys(d.choices || {}).length,
        })));
      } catch (err) {
        console.error("Failed to load meal trend:", err);
      }
      setLoadingTrend(false);
    })();
  }, [hostelId]);

  useEffect(() => {
    if (!hostelId) return;
    const unsub = onSnapshot(collection(db, "hostels", hostelId, "payments"), (snap) => {
      setPayments(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, [hostelId]);

  const total = students.length;
  const activeCount = students.filter(s => (s.status || "active") === "active").length;
  const paidCount = students.filter(s => s.rentStatus === "paid").length;
  const dueCount = students.filter(s => s.rentStatus === "due").length;
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const rentPieData = [
    { name: "Paid", value: paidCount, color: GREEN },
    { name: "Due", value: dueCount, color: "#E0435A" },
  ];

  const handleExportCsv = () => {
    const header = ["Name", "Room", "CARE ID", "Status", "Rent Status"];
    const rows = students.map(s => [
      s.name || "", s.room || "", s.careId || "", s.status || "active", s.rentStatus || "due",
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `students-${todayKey()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 18, color: GREEN, marginBottom: 2 }}>Reports</div>
      <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 14 }}>Analytics computed from your real hostel data.</div>

      {/* Analytics summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{total}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Total Students</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{activeCount}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Active</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>৳ {totalCollected.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Total Collected</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{total ? Math.round((paidCount / total) * 100) : 0}%</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Rent Collection Rate</div>
        </div>
      </div>

      {/* Rent status pie */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A", marginBottom: 10 }}>Rent Status</div>
        {total === 0 ? (
          <div style={{ fontSize: 12.5, color: "#6b6d66" }}>No students yet.</div>
        ) : (
          <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rentPieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65}>
                  {rentPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Meal participation trend */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A", marginBottom: 10 }}>Meal Participation (last 7 days)</div>
        {loadingTrend ? (
          <div style={{ fontSize: 12, color: "#8B8D86" }}>Loading...</div>
        ) : mealTrend.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "#6b6d66" }}>No meal data yet — set a menu in the Meals tab first.</div>
        ) : (
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#8B8D86" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="responses" fill={GREEN} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Export */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A", marginBottom: 4 }}>Export</div>
        <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 12 }}>
          Download your current student roster (name, room, CARE ID, status, rent) as a CSV file.
        </div>
        <button onClick={handleExportCsv} disabled={total === 0} style={{
          width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
          padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", opacity: total === 0 ? 0.6 : 1
        }}>
          <FileText size={15} /> Export Students CSV
        </button>
      </div>
    </div>
  );
}

