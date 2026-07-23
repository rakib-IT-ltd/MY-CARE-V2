import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowLeftRight, Bell, Building2, CheckCircle2, ChevronRight, GraduationCap,
  School, BookOpen, BarChart3, Thermometer, MessageSquare, ShieldCheck, FileText, Wallet2,
  Megaphone, Library, MoreHorizontal, Calendar, Trophy, UploadCloud, Receipt, Users, UserRound,
  Coins, Truck, BedDouble, ClipboardCheck, Smile, Home as HomeIcon, User, UserPlus,
} from "lucide-react";
import { GREEN } from "../../../constants/colors";
import CareIdBadge from "../../../components/careIdbadge";
import ConnectByCareId from "../../../components/connectbycareid";
import PendingRequestCard from "../../../components/pendingrequestcard";
import SectionTitle from "../../../components/sectiontitle";

const schStudentClasses = [
  { key: "eng", time: "08:00 AM", name: "English", room: "Room 101", icon: BookOpen, fg: "#6E4FD1" },
  { key: "math", time: "09:00 AM", name: "Math", room: "Room 102", icon: BarChart3, fg: "#2F6FE0" },
  { key: "sci", time: "10:30 AM", name: "Science", room: "Lab 1", icon: Thermometer, fg: "#E08A20" },
  { key: "ict", time: "11:30 AM", name: "ICT", room: "Room 203", icon: MessageSquare, fg: "#1F8A5A" },
  { key: "bangla", time: "01:00 PM", name: "Bangla", room: "Room 104", icon: BookOpen, fg: "#E0435A" },
];

const schStudentProgress = [
  { key: "attendance", icon: ShieldCheck, fg: "#1F8A5A", label: "Attendance", value: "90%" },
  { key: "homework", icon: BookOpen, fg: "#2F6FE0", label: "Homework", value: "2 Pending" },
  { key: "tests", icon: FileText, fg: "#E08A20", label: "Tests", value: "1 Upcoming" },
  { key: "marks", icon: BarChart3, fg: "#6E4FD1", label: "Average Marks", value: "85%" },
];

const schStudentQuickAccess = [
  { key: "homework", name: "Homework", icon: BookOpen, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "library", name: "Library", icon: Library, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schStudentUpdates = [
  { key: "hw", text: "Math homework is due tomorrow", meta: "Yesterday" },
  { key: "closed", text: "School will remain closed on 25 May", meta: "08:30 AM" },
  { key: "test", text: "Science test on Chapter 5 on 22 May", meta: "Yesterday" },
];

const schChildOverview = [
  { key: "attendance", icon: ShieldCheck, fg: "#1F8A5A", bg: "#E4F3EA", label: "Attendance", value: "96%", sub: "This Month" },
  { key: "homework", icon: BookOpen, fg: "#2F6FE0", bg: "#E5EFFC", label: "Homework", value: "", sub: "" },
  { key: "marks", icon: BarChart3, fg: "#E08A20", bg: "#FDF0DF", label: "Average Marks", value: "88%", sub: "" },
  { key: "behavior", icon: Smile, fg: "#6E4FD1", bg: "#EFEAFB", label: "Behavior", value: "Excellent", sub: "" },
];

const schTodayAtSchool = [
  { key: "eng", time: "08:00 AM", name: "English", status: "Completed", color: "#1F8A5A" },
  { key: "math", time: "09:00 AM", name: "Math", status: "Ongoing", color: "#2F6FE0" },
  { key: "sci", time: "10:30 AM", name: "Science", status: "Upcoming", color: "#8B8D86" },
];

const schParentQuickAccess = [
  { key: "childprogress", name: "Child Progress", icon: BarChart3, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "homework", name: "Homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "examsched", name: "Exam Schedule", icon: Calendar, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "results", name: "Results", icon: Trophy, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schParentUpdates = [
  { key: "meeting", text: "Parents meeting on 24 May at 10:00 AM", meta: "2h ago" },
  { key: "hw", text: "Math homework is due tomorrow", meta: "Yesterday" },
  { key: "fee", text: "Monthly fee for May is paid", meta: "2 May" },
];

const schTeacherSchedule = [
  { key: "c9a", time: "08:00 AM", name: "Class 9A", room: "Room 102" },
  { key: "c8b", time: "09:00 AM", name: "Class 8B", room: "Room 102" },
  { key: "c7a", time: "10:30 AM", name: "Class 7A", room: "Room 102" },
  { key: "c10a", time: "01:00 PM", name: "Class 10A", room: "Room 102" },
];

const schTeacherStats = [
  { key: "classes", icon: BookOpen, fg: "#2F6FE0", bg: "#E5EFFC", value: "4", label: "Classes" },
  { key: "students", icon: Users, fg: "#1F8A5A", bg: "#E4F3EA", value: "128", label: "Students" },
  { key: "attendance", icon: ShieldCheck, fg: "#E08A20", bg: "#FDF0DF", value: "92%", label: "Attendance" },
  { key: "pending", icon: ClipboardCheck, fg: "#6E4FD1", bg: "#EFEAFB", value: "5", label: "Pending Work" },
];

const schTeacherQuickAccess = [
  { key: "takeatt", name: "Take Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "assignhw", name: "Assign Homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "uploadresult", name: "Upload Result", icon: UploadCloud, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "noticeboard", name: "Notice Board", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "examsched", name: "Exam Schedule", icon: Calendar, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "reports", name: "Reports", icon: Receipt, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "message", name: "Message", icon: MessageSquare, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schTeacherActivities = [
  { key: "hw", text: "Homework assigned to Class 9A", meta: "1h ago" },
  { key: "att", text: "Attendance marked for Class 8B", meta: "2h ago" },
  { key: "result", text: "Result uploaded for Class 7A", meta: "Yesterday" },
];

const schOverviewStats = [
  { key: "students", icon: Users, fg: "#1F8A5A", bg: "#E4F3EA", value: "1,245", label: "Total Students" },
  { key: "teachers", icon: UserRound, fg: "#E08A20", bg: "#FDF0DF", value: "68", label: "Teachers" },
  { key: "attendance", icon: BarChart3, fg: "#2F6FE0", bg: "#E5EFFC", value: "91%", label: "Attendance" },
  { key: "fee", icon: Coins, fg: "#6E4FD1", bg: "#EFEAFB", value: "78%", label: "Fee Collection" },
];

const schAdminQuickAccess = [
  { key: "students", name: "Students", icon: Users, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "teachers", name: "Teachers", icon: UserRound, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "exams", name: "Exams", icon: FileText, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "results", name: "Results", icon: Trophy, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "library", name: "Library", icon: Library, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "transport", name: "Transport", icon: Truck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hostel", name: "Hostel", icon: BedDouble, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "reports", name: "Reports", icon: Receipt, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schAdminUpdates = [
  { key: "fair", text: "Science fair on 30 May 2025", meta: "3h ago" },
  { key: "fee", text: "April fee collection report generated", meta: "5h ago" },
  { key: "admission", text: "New student admission: 12", meta: "Yesterday" },
];

const schAdminSummary = [
  { key: "classes", label: "Classes Running", value: "42" },
  { key: "attendance", label: "Today's Attendance", value: "92%" },
  { key: "teachers", label: "Teachers Present", value: "60" },
  { key: "fee", label: "Pending Fee", value: "৳ 2,45,000" },
];

const schStudentTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "classes", name: "Classes", icon: BookOpen },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schParentTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "child", name: "Child", icon: UserRound },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schTeacherTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "classes", name: "Classes", icon: BookOpen },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schAdminTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "reports", name: "Reports", icon: Receipt },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];

function SchQuickAccess({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {items.map(q => {
        const Icon = q.icon;
        return (
          <div key={q.key} style={{ textAlign: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: q.bg, margin: "0 auto 6px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={19} color={q.fg} />
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
          </div>
        );
      })}
    </div>
  );
}

function SchUpdatesList({ items }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
      {items.map((u, i) => (
        <div key={u.key} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
          borderBottom: i < items.length - 1 ? "1px solid #F0F1EC" : "none"
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c7c8c2", flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 13, color: "#1A1A1A" }}>{u.text}</div>
          <div style={{ fontSize: 11, color: "#8B8D86", whiteSpace: "nowrap" }}>{u.meta}</div>
        </div>
      ))}
    </div>
  );
}

function SchoolStudentDashboard() {
  const [incomingRequests, setIncomingRequests] = useState([
    { key: "parent1", name: "Hasan Al Mamun", sub: "Wants to link as your parent", initials: "HM", bg: "#E4F3EA", fg: "#1F8A5A" },
  ]);
  const [connectedNote, setConnectedNote] = useState("");

  const handleAccept = (key) => {
    const req = incomingRequests.find(r => r.key === key);
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
    if (req) setConnectedNote(`You're now linked with ${req.name}.`);
  };
  const handleDecline = (key) => {
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
  };

  return (
    <div>
      {incomingRequests.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle>Connection Requests</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {incomingRequests.map(r => (
              <PendingRequestCard
                key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                onAccept={() => handleAccept(r.key)} onDecline={() => handleDecline(r.key)}
              />
            ))}
          </div>
        </div>
      )}
      {connectedNote && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} /> {connectedNote}
        </div>
      )}
      <div style={{
        background: "#F3F0FC", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#EFEAFB", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6E4FD1", fontSize: 16, flexShrink: 0
        }}>RH</div>
        <div>
          <div style={{ fontSize: 12, color: "#6E4FD1", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <GraduationCap size={14} /> Student Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Rakib Hasan 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Class 9 · Section A</div>
        </div>
      </div>

      <SectionTitle action="View all">Today's Classes</SectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schStudentClasses.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={c.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < schStudentClasses.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <Icon size={16} color={c.fg} />
              <div style={{ fontSize: 12, color: "#8B8D86", width: 62 }}>{c.time}</div>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{c.room}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle action="This week">My Progress</SectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schStudentProgress.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={p.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
              borderBottom: i < schStudentProgress.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <Icon size={16} color={p.fg} />
              <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{p.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{p.value}</span>
            </div>
          );
        })}
      </div>

      <SectionTitle>Quick Access</SectionTitle>
      <SchQuickAccess items={schStudentQuickAccess} />

      <SectionTitle action="View all">Recent Updates</SectionTitle>
      <SchUpdatesList items={schStudentUpdates} />
    </div>
  );
}

function SchoolParentDashboard() {
  const [showLinkChild, setShowLinkChild] = useState(false);
  const [linkedNote, setLinkedNote] = useState("");

  return (
    <div>
      <div style={{
        background: "#EAF6EF", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#E4F3EA", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: GREEN, fontSize: 16, flexShrink: 0
        }}>HM</div>
        <div>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Users size={14} /> Parent Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Hasan Al Mamun 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Parent of Rakib Hasan</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Child Overview</span>
        <button onClick={() => setShowLinkChild(o => !o)} style={{
          background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 12.5,
          display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
        }}>
          <UserPlus size={13} /> Link Child
        </button>
      </div>

      {showLinkChild && (
        <div style={{ marginBottom: 14 }}>
          <ConnectByCareId
            label="Link your child by their CARE ID"
            onSent={(profile) => setLinkedNote(`Request sent to ${profile.name}. They'll need to accept before you're linked.`)}
          />
        </div>
      )}
      {linkedNote && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} /> {linkedNote}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schChildOverview.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: c.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={c.fg} />
              </div>
              {c.value && <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A" }}>{c.value}</div>}
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{c.label}</div>
              {c.sub && <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{c.sub}</div>}
            </div>
          );
        })}
      </div>

      <SectionTitle>Today at School</SectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "14px 16px" }}>
        {schTodayAtSchool.map((t, i) => (
          <div key={t.key} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, marginTop: 4 }} />
              {i < schTodayAtSchool.length - 1 && <div style={{ width: 2, flex: 1, background: "#ECEDE8", marginTop: 2 }} />}
            </div>
            <div style={{ paddingBottom: 16, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{t.time}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{t.name}</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: t.color }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Quick Access</SectionTitle>
      <SchQuickAccess items={schParentQuickAccess} />

      <SectionTitle action="View all">Recent Updates</SectionTitle>
      <SchUpdatesList items={schParentUpdates} />
    </div>
  );
}

function SchoolTeacherDashboard() {
  return (
    <div>
      <div style={{
        background: "#EAF1FC", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#E5EFFC", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2F6FE0", fontSize: 16, flexShrink: 0
        }}>AS</div>
        <div>
          <div style={{ fontSize: 12, color: "#2F6FE0", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <User size={14} /> Teacher Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Abdullah Sir 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Math Teacher</div>
        </div>
      </div>

      <SectionTitle action="View all">Today's Schedule</SectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schTeacherSchedule.map((s, i) => (
          <div key={s.key} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < schTeacherSchedule.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <Users size={16} color="#2F6FE0" />
            <div style={{ fontSize: 12, color: "#8B8D86", width: 62 }}>{s.time}</div>
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.room}</div>
          </div>
        ))}
      </div>

      <SectionTitle>My Classes</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schTeacherStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: s.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={s.fg} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Quick Access</SectionTitle>
      <SchQuickAccess items={schTeacherQuickAccess} />

      <SectionTitle action="View all">Recent Activities</SectionTitle>
      <SchUpdatesList items={schTeacherActivities} />
    </div>
  );
}

function SchoolAdminDashboard() {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div>
      <div style={{
        background: "#FDF0DF", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, background: "#FDEFE4", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <School size={24} color="#E08A20" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#E08A20", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Building2 size={14} /> School Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Admin 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Greenfield School</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <button onClick={() => setShowAddMember(o => !o)} style={{
          background: "#E08A20", border: "none", borderRadius: 999, padding: "8px 14px",
          fontSize: 12.5, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
        }}>
          <UserPlus size={13} /> Add Student / Teacher
        </button>
      </div>
      {showAddMember && (
        <div style={{ marginBottom: 14 }}>
          <ConnectByCareId label="Add a student or teacher by their CARE ID" />
        </div>
      )}

      <SectionTitle action="This month">School Overview</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schOverviewStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: s.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={s.fg} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Quick Access</SectionTitle>
      <SchQuickAccess items={schAdminQuickAccess} />

      <SectionTitle action="View all">Recent Updates</SectionTitle>
      <SchUpdatesList items={schAdminUpdates} />

      <SectionTitle>Today's Summary</SectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 16px" }}>
        {schAdminSummary.map((s, i) => (
          <div key={s.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0",
            borderBottom: i < schAdminSummary.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <span style={{ fontSize: 13, color: "#1A1A1A" }}>{s.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const schoolRoles = [
  { key: "student", name: "I'm a Student", sub: "See classes, homework and progress", icon: GraduationCap, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "parent", name: "I'm a Parent", sub: "Track your child's school life", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "teacher", name: "I'm a Teacher", sub: "Manage classes, homework and results", icon: User, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "school", name: "I'm from School", sub: "Run school-wide operations", icon: School, bg: "#FDF0DF", fg: "#E08A20" },
];

function SchoolRolePicker({ onChoose }) {
  return (
    <div style={{ padding: "8px 20px 40px" }}>
      <div style={{ textAlign: "center", margin: "20px 0 24px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "#E5EFFC", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <GraduationCap size={28} color="#2F6FE0" />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#1A1A1A" }}>Choose your role</h2>
        <p style={{ margin: 0, fontSize: 12.5, color: "#6b6d66" }}>Select your role to get a personalised dashboard</p>
      </div>

      {schoolRoles.map(r => {
        const Icon = r.icon;
        return (
          <button key={r.key} onClick={() => onChoose(r.key)} style={{
            width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
            padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 12
          }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color={r.fg} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{r.sub}</div>
            </div>
            <ChevronRight size={18} color="#c7c8c2" />
          </button>
        );
      })}

      <div style={{ marginTop: 8, background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12, fontSize: 11.5, color: "#6b6d66", lineHeight: 1.5 }}>
        You can change your role anytime from School Settings. Your CARE ID connects you to your school just like it does in Hostel, Family and every other section.
      </div>
    </div>
  );
}

export default function SchoolPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [activeSchTab, setActiveSchTab] = useState("home");

  const roleMeta = {
    student: { title: "School", tabs: schStudentTabs, accent: "#6E4FD1", Dashboard: SchoolStudentDashboard },
    parent: { title: "School", tabs: schParentTabs, accent: GREEN, Dashboard: SchoolParentDashboard },
    teacher: { title: "School", tabs: schTeacherTabs, accent: "#2F6FE0", Dashboard: SchoolTeacherDashboard },
    school: { title: "School", tabs: schAdminTabs, accent: "#E08A20", Dashboard: SchoolAdminDashboard },
  };

  if (!role) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 0" }}>
          <button onClick={() => navigate(-1)} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <ArrowLeft size={18} color="#1A1A1A" />
          </button>
        </div>
        <SchoolRolePicker onChoose={(r) => { setRole(r); setActiveSchTab("home"); }} />
      </div>
    );
  }

  const meta = roleMeta[role];
  const Dashboard = meta.Dashboard;

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
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>School</div>
        <div style={{ position: "relative" }}>
          <Bell size={19} color="#1A1A1A" />
          <span style={{
            position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
            fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>3</span>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 14px" }}>
          <CareIdBadge compact />
          <button onClick={() => setRole(null)} style={{
            background: "none", border: "1px solid #ECEDE8", borderRadius: 999, padding: "5px 10px",
            fontSize: 11.5, fontWeight: 600, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5, cursor: "pointer"
          }}>
            <ArrowLeftRight size={12} /> Switch role
          </button>
        </div>

        <Dashboard />

        {/* Section tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {meta.tabs.map(t => {
            const Icon = t.icon;
            const active = activeSchTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveSchTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? meta.accent : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? meta.accent : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

