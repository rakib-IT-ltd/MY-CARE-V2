import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  collection, doc, getDoc, setDoc, updateDoc, addDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firestore";
import {
  ArrowLeft, ArrowLeftRight, BedDouble, Bell, ChevronRight, Menu, UserCog, GraduationCap,
} from "lucide-react";
import { useCurrentUser } from "../../../contexts/currentusercontext";
import { GREEN } from "../../../constants/colors";
import CareIdBadge from "../../../components/careIdbadge";
import { managerTabs, studentTabs } from "../../../constants/hosteldata";

const TAB_ROUTES = {
  dashboard: "/hostel",
  students: "/hostel/students",
  meals: "/hostel/meals",
  rent: "/hostel/rent",
  reports: "/hostel/reports",
};

function RolePicker({ onChoose }) {
  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "#E4F3EA", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <BedDouble size={28} color={GREEN} />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 19, color: "#1A1A1A" }}>Hostel</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6b6d66" }}>How do you want to use this section?</p>
      </div>

      <button onClick={() => onChoose("manager")} style={{
        width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
        padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 12
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: "#E4F3EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <UserCog size={22} color={GREEN} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>I'm a Manager</div>
          <div style={{ fontSize: 12, color: "#8B8D86" }}>Run meals, rooms, rent and students</div>
        </div>
        <ChevronRight size={18} color="#c7c8c2" />
      </button>

      <button onClick={() => onChoose("student")} style={{
        width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
        padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer"
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: "#E5EFFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <GraduationCap size={22} color="#2F6FE0" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>I'm a Student</div>
          <div style={{ fontSize: 12, color: "#8B8D86" }}>See your room, meals and rent</div>
        </div>
        <ChevronRight size={18} color="#c7c8c2" />
      </button>

      <div style={{ marginTop: 20, background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12, fontSize: 11.5, color: "#6b6d66", lineHeight: 1.5 }}>
        Every My Care user has a unique CARE ID. Managers add students to their hostel using this ID — the same ID connects you across Family, Travel, Health and every other section.
      </div>
    </div>
  );
}

export default function HostelLayout() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingRole, setLoadingRole] = useState(true);
  const [role, setRole] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const tabs = role === "manager" ? managerTabs : studentTabs;

  useEffect(() => {
    if (!hostelId) { setStudents([]); return; }
    const unsub = onSnapshot(collection(db, "hostels", hostelId, "students"), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [hostelId]);

  const updateStudentField = async (uid, fields) => {
    await updateDoc(doc(db, "hostels", hostelId, "students", uid), fields);
  };

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (data.hostel) {
          setRole(data.hostel.role);
          setHostelId(data.hostel.hostelId || null);
        }
      } catch (err) {
        console.error("Failed to load hostel role:", err);
      }
      setLoadingRole(false);
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!hostelId) { setHostelInfo(null); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "hostels", hostelId));
        if (snap.exists()) setHostelInfo(snap.data());
      } catch (err) {
        console.error("Failed to load hostel info:", err);
      }
    })();
  }, [hostelId]);

  const handleChooseRole = async (r) => {
    if (!currentUser) return;
    if (r === "manager") {
      const newHostelRef = await addDoc(collection(db, "hostels"), {
        name: `${currentUser.name}'s Hostel`,
        managerUid: currentUser.uid,
        managerName: currentUser.name,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", currentUser.uid), {
        hostel: { role: "manager", hostelId: newHostelRef.id },
      }, { merge: true });
      setHostelId(newHostelRef.id);
    } else {
      await setDoc(doc(db, "users", currentUser.uid), {
        hostel: { role: "student", hostelId: null },
      }, { merge: true });
      setHostelId(null);
    }
    setRole(r);
    navigate("/hostel");
  };

  const handleSwitchRole = async () => {
    setRole(null);
    setHostelId(null);
    setHostelInfo(null);
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { hostel: null }, { merge: true });
    }
    navigate("/hostel");
  };

  const handleAccepted = (newHostelId) => {
    setHostelId(newHostelId);
  };

  if (loadingRole) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#8B8D86", fontSize: 13 }}>
        Loading...
      </div>
    );
  }

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
        <RolePicker onChoose={handleChooseRole} />
      </div>
    );
  }

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
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <BedDouble size={17} color={GREEN} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16.5, color: "#1A1A1A" }}>
              {role === "manager" ? "Hostel Manager" : `Good Morning, ${(currentUser?.name || "there").split(" ")[0]} 👋`}
            </div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>
              {role === "manager" ? "Manager Dashboard" : "Have a great day!"}
            </div>
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
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        {/* CARE ID + role switch */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 14px" }}>
          <CareIdBadge compact />
          <button onClick={handleSwitchRole} style={{
            background: "none", border: "1px solid #ECEDE8", borderRadius: 999, padding: "5px 10px",
            fontSize: 11.5, fontWeight: 600, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5, cursor: "pointer"
          }}>
            <ArrowLeftRight size={12} /> Switch role
          </button>
        </div>

        <Outlet context={{ role, currentUser, hostelId, hostelInfo, students, updateStudentField, handleAccepted }} />

        {/* Section tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const targetRoute = TAB_ROUTES[t.key];
            const active = targetRoute ? location.pathname === targetRoute : false;
            return (
              <button
                key={t.key}
                onClick={() => targetRoute && navigate(targetRoute)}
                disabled={!targetRoute}
                style={{
                  background: "none", border: "none", cursor: targetRoute ? "pointer" : "default", flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px",
                  opacity: targetRoute ? 1 : 0.4
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
