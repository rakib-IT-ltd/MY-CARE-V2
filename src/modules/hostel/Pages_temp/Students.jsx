import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Users, User, Clock, Briefcase, Search, SquarePen, ChevronRight, CheckCircle2,
  UserPlus, ClipboardCheck, Utensils, FileText, MoreHorizontal,
} from "lucide-react";
import { GREEN } from "../../../constants/colors";
import { getInitialsFrom } from "../../../utils/helpers";
import SectionTitle from "../../../components/sectiontitle";

export default function Students() {
  const navigate = useNavigate();
  const { students, updateStudentField } = useOutletContext();
  const onUpdateStudent = updateStudentField;
  const onOpenAdd = () => navigate("/hostel");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | due | onLeave
  const [expandedId, setExpandedId] = useState(null);

  const total = students.length;
  const activeCount = students.filter(s => (s.status || "active") === "active").length;
  const dueCount = students.filter(s => s.rentStatus === "due").length;
  const onLeaveCount = students.filter(s => s.status === "onLeave").length;

  const filtered = students.filter(s => {
    const matchesSearch = !search.trim() || [s.name, s.room, s.careId].some(
      v => (v || "").toLowerCase().includes(search.trim().toLowerCase())
    );
    const matchesFilter =
      filter === "all" ? true :
      filter === "active" ? (s.status || "active") === "active" :
      filter === "due" ? s.rentStatus === "due" :
      filter === "onLeave" ? s.status === "onLeave" : true;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { key: "all", value: total, label: "Total Students", bg: "#E4F3EA", fg: GREEN, icon: Users },
    { key: "active", value: activeCount, label: "Active", bg: "#E4F3EA", fg: GREEN, icon: User },
    { key: "due", value: dueCount, label: "Due Rent", bg: "#FCE9EB", fg: "#E0435A", icon: Clock },
    { key: "onLeave", value: onLeaveCount, label: "On Leave", bg: "#FDF0DF", fg: "#E08A20", icon: Briefcase },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: GREEN }}>Students Dashboard</div>
          <div style={{ fontSize: 11.5, color: "#8B8D86" }}>Manage all hostel students</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {stats.map(s => {
          const Icon = s.icon;
          const active = filter === s.key;
          return (
            <button key={s.key} onClick={() => setFilter(active ? "all" : s.key)} style={{
              textAlign: "left", background: s.bg, border: active ? `2px solid ${s.fg}` : "2px solid transparent",
              borderRadius: 14, padding: 14, cursor: "pointer"
            }}>
              <Icon size={18} color={s.fg} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b6d66" }}>{s.label}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff",
          border: "1px solid #ECEDE8", borderRadius: 12, padding: "9px 12px"
        }}>
          <Search size={15} color="#8B8D86" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, room, CARE ID..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 12.5, background: "transparent" }}
          />
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #ECEDE8",
          borderRadius: 12, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", cursor: "pointer"
        }}>
          <SquarePen size={14} /> Filter
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: GREEN }}>All Students ({filtered.length})</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 20,
          textAlign: "center", fontSize: 12.5, color: "#6b6d66", marginBottom: 16
        }}>
          {total === 0 ? "No students yet — add one using Quick Entry on the Dashboard." : "No students match your search/filter."}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {filtered.map((s, i) => {
            const expanded = expandedId === s.id;
            const statusLabel = s.status === "onLeave" ? "On Leave" : "Active";
            const statusColor = s.status === "onLeave" ? "#E08A20" : GREEN;
            const statusBg = s.status === "onLeave" ? "#FDF0DF" : "#E4F3EA";
            return (
              <div key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0F1EC" : "none" }}>
                <button
                  onClick={() => setExpandedId(expanded ? null : s.id)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 0", textAlign: "left"
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: "#E4F3EA",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: GREEN, flexShrink: 0
                  }}>{getInitialsFrom(s.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#8B8D86" }}>
                      Room {s.room || "Not set"} · {s.careId}
                    </div>
                    <span style={{
                      display: "inline-block", marginTop: 4, background: statusBg, color: statusColor,
                      fontSize: 10, fontWeight: 600, borderRadius: 999, padding: "2px 8px"
                    }}>{statusLabel}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {s.rentStatus === "due" ? (
                      <span style={{ color: "#E0435A", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} /> Due
                      </span>
                    ) : (
                      <span style={{ color: GREEN, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={13} /> Paid
                      </span>
                    )}
                  </div>
                  <ChevronRight size={16} color="#c7c8c2" style={{ transform: expanded ? "rotate(90deg)" : "none" }} />
                </button>

                {expanded && (
                  <div style={{ background: "#F7F8F4", borderRadius: 12, padding: 12, margin: "0 0 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#6b6d66", width: 60 }}>Room</span>
                      <input
                        defaultValue={s.room || ""}
                        onBlur={e => onUpdateStudent(s.id, { room: e.target.value })}
                        placeholder="e.g. 203"
                        style={{ flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "6px 10px", fontSize: 12.5 }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b6d66", width: 60, paddingTop: 6 }}>Status</span>
                      <div style={{ display: "flex", gap: 6, flex: 1 }}>
                        <button onClick={() => onUpdateStudent(s.id, { status: "active" })} style={{
                          flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          border: "none", background: (s.status || "active") === "active" ? GREEN : "#fff",
                          color: (s.status || "active") === "active" ? "#fff" : "#1A1A1A",
                          boxShadow: (s.status || "active") === "active" ? "none" : "0 0 0 1px #ECEDE8 inset"
                        }}>Active</button>
                        <button onClick={() => onUpdateStudent(s.id, { status: "onLeave" })} style={{
                          flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          border: "none", background: s.status === "onLeave" ? "#E08A20" : "#fff",
                          color: s.status === "onLeave" ? "#fff" : "#1A1A1A",
                          boxShadow: s.status === "onLeave" ? "none" : "0 0 0 1px #ECEDE8 inset"
                        }}>On Leave</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b6d66", width: 60, paddingTop: 6 }}>Rent</span>
                      <div style={{ display: "flex", gap: 6, flex: 1 }}>
                        <button onClick={() => onUpdateStudent(s.id, { rentStatus: "paid" })} style={{
                          flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          border: "none", background: s.rentStatus === "paid" ? GREEN : "#fff",
                          color: s.rentStatus === "paid" ? "#fff" : "#1A1A1A",
                          boxShadow: s.rentStatus === "paid" ? "none" : "0 0 0 1px #ECEDE8 inset"
                        }}>Paid</button>
                        <button onClick={() => onUpdateStudent(s.id, { rentStatus: "due" })} style={{
                          flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          border: "none", background: s.rentStatus === "due" ? "#E0435A" : "#fff",
                          color: s.rentStatus === "due" ? "#fff" : "#1A1A1A",
                          boxShadow: s.rentStatus === "due" ? "none" : "0 0 0 1px #ECEDE8 inset"
                        }}>Due</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <SectionTitle>Quick Actions</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { key: "add", name: "Add Student", icon: UserPlus, bg: "#E4F3EA", fg: GREEN, onClick: onOpenAdd },
          { key: "attendance", name: "Attendance", icon: ClipboardCheck, bg: "#E5EFFC", fg: "#2F6FE0", onClick: null },
          { key: "meals", name: "Meal Summary", icon: Utensils, bg: "#FDF0DF", fg: "#E08A20", onClick: null },
          { key: "export", name: "Export Report", icon: FileText, bg: "#EFEAFB", fg: "#6E4FD1", onClick: null },
        ].map(q => {
          const Icon = q.icon;
          return (
            <button key={q.key} onClick={q.onClick || undefined} style={{
              textAlign: "center", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14,
              padding: "12px 6px", cursor: q.onClick ? "pointer" : "default", opacity: q.onClick ? 1 : 0.6
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: q.bg, margin: "0 auto 6px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Icon size={16} color={q.fg} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: "#8B8D86", textAlign: "center", marginBottom: 4 }}>
        Attendance, Meal Summary shortcuts, and Export Report are coming in a later step.
      </div>
    </div>
  );
}

