import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  collection, doc, addDoc, updateDoc, query, orderBy, limit, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import { Banknote } from "lucide-react";
import { GREEN } from "../../../constants/colors";
import { getInitialsFrom } from "../../../utils/helpers";
import SectionTitle from "../../../components/sectiontitle";

export default function Rent() {
  const { hostelId, students, hostelInfo, updateStudentField } = useOutletContext();
  const onUpdateStudent = updateStudentField;
  const [monthlyRent, setMonthlyRent] = useState(hostelInfo?.monthlyRent || 0);
  const [rentInput, setRentInput] = useState(String(hostelInfo?.monthlyRent || ""));
  const [savingRent, setSavingRent] = useState(false);
  const [payments, setPayments] = useState([]);
  const [markingPaidId, setMarkingPaidId] = useState(null);

  useEffect(() => {
    setMonthlyRent(hostelInfo?.monthlyRent || 0);
    setRentInput(String(hostelInfo?.monthlyRent || ""));
  }, [hostelInfo]);

  useEffect(() => {
    if (!hostelId) return;
    const q = query(collection(db, "hostels", hostelId, "payments"), orderBy("date", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [hostelId]);

  const handleSaveRent = async () => {
    const amount = Number(rentInput) || 0;
    setSavingRent(true);
    try {
      await updateDoc(doc(db, "hostels", hostelId), { monthlyRent: amount });
      setMonthlyRent(amount);
    } finally {
      setSavingRent(false);
    }
  };

  const handleMarkPaid = async (student) => {
    setMarkingPaidId(student.id);
    try {
      await addDoc(collection(db, "hostels", hostelId, "payments"), {
        studentUid: student.id,
        studentName: student.name,
        amount: monthlyRent,
        date: serverTimestamp(),
      });
      await onUpdateStudent(student.id, { rentStatus: "paid" });
    } finally {
      setMarkingPaidId(null);
    }
  };

  const paidCount = students.filter(s => s.rentStatus === "paid").length;
  const dueStudents = students.filter(s => s.rentStatus === "due");

  const now = new Date();
  const collectedThisMonth = payments
    .filter(p => p.date?.toDate && p.date.toDate().getMonth() === now.getMonth() && p.date.toDate().getFullYear() === now.getFullYear())
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstandingTotal = dueStudents.length * monthlyRent;

  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 18, color: GREEN, marginBottom: 2 }}>Rent</div>
      <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 14 }}>Track collections, dues, and payment history.</div>

      {/* Monthly rent setting */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Monthly rent per student (৳)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={rentInput}
            onChange={e => setRentInput(e.target.value)}
            placeholder="e.g. 4000"
            style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "9px 10px", fontSize: 13 }}
          />
          <button onClick={handleSaveRent} disabled={savingRent} style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px",
            fontWeight: 600, fontSize: 12.5, cursor: "pointer", opacity: savingRent ? 0.7 : 1
          }}>{savingRent ? "Saving..." : "Save"}</button>
        </div>
      </div>

      {/* Payment Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#E4F3EA", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>৳ {collectedThisMonth.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Collected this month</div>
        </div>
        <div style={{ background: "#FCE9EB", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>৳ {outstandingTotal.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Outstanding ({dueStudents.length} students)</div>
        </div>
        <div style={{ background: "#E5EFFC", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{paidCount}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Paid students</div>
        </div>
        <div style={{ background: "#FDF0DF", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{dueStudents.length}</div>
          <div style={{ fontSize: 12, color: "#6b6d66" }}>Due students</div>
        </div>
      </div>

      {/* Dues list */}
      <SectionTitle>Students with Due Rent</SectionTitle>
      {dueStudents.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          fontSize: 12.5, color: "#6b6d66", marginBottom: 16
        }}>
          Everyone's paid up — no dues right now.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {dueStudents.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < dueStudents.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "#FCE9EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: "#E0435A", fontSize: 12.5, flexShrink: 0
              }}>{getInitialsFrom(s.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>Room {s.room || "Not set"}</div>
              </div>
              <button
                onClick={() => handleMarkPaid(s)}
                disabled={markingPaidId === s.id || !monthlyRent}
                title={!monthlyRent ? "Set a monthly rent amount first" : ""}
                style={{
                  background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px",
                  fontSize: 11.5, fontWeight: 600, cursor: "pointer", opacity: markingPaidId === s.id || !monthlyRent ? 0.6 : 1
                }}
              >
                {markingPaidId === s.id ? "Saving..." : "Mark Paid"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment History */}
      <SectionTitle>Payment History</SectionTitle>
      {payments.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          fontSize: 12.5, color: "#6b6d66"
        }}>
          No payments recorded yet.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {payments.map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < payments.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Banknote size={15} color={GREEN} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{p.studentName}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>
                  {p.date?.toDate ? p.date.toDate().toLocaleDateString() : "Just now"}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>৳ {(p.amount || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

