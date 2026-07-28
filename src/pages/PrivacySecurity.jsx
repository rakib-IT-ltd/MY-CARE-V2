import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser,
} from "firebase/auth";
import {
  doc, getDoc, deleteDoc, updateDoc, collection, query, orderBy, limit, getDocs,
} from "firebase/firestore";
import {
  ArrowLeft, Lock, ShieldCheck, Monitor, Clock, Eye, Download, Trash2, LogOut,
  CheckCircle2, ChevronRight, ChevronDown,
} from "lucide-react";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN, GREEN_DARK } from "../constants/colors";

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8",
  fontSize: 13.5, boxSizing: "border-box", background: "#fff", color: "#1A1A1A",
};

function SectionCard({ children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function RowHeader({ icon: Icon, fg, bg, title, expanded, onClick, disabled, disabledNote }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none",
      border: "none", cursor: disabled ? "default" : "pointer", padding: 0, textAlign: "left",
      opacity: disabled ? 0.55 : 1
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <Icon size={16} color={fg} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{title}</div>
        {disabled && disabledNote && <div style={{ fontSize: 10.5, color: "#8B8D86", marginTop: 2 }}>{disabledNote}</div>}
      </div>
      {!disabled && (
        expanded
          ? <ChevronDown size={16} color="#c7c8c2" />
          : <ChevronRight size={16} color="#c7c8c2" />
      )}
    </button>
  );
}

export default function PrivacySecurityPage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [openSection, setOpenSection] = useState(null);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");

  // Login history
  const [loginHistory, setLoginHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Privacy toggle
  const [shareContactInfo, setShareContactInfo] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Delete account
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (typeof data.privacySettings?.shareContactInfo === "boolean") {
          setShareContactInfo(data.privacySettings.shareContactInfo);
        }
      } catch (err) {
        console.error("Failed to load privacy settings:", err);
      }
    })();
  }, [currentUser]);

  const toggleSection = async (key) => {
    const next = openSection === key ? null : key;
    setOpenSection(next);
    if (next === "history" && loginHistory.length === 0) {
      setLoadingHistory(true);
      try {
        const q = query(collection(db, "users", currentUser.uid, "loginHistory"), orderBy("timestamp", "desc"), limit(20));
        const snap = await getDocs(q);
        setLoginHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load login history:", err);
      }
      setLoadingHistory(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!currentPassword || !newPassword) {
      setPwError("Fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }
    setPwSaving(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPwSuccess("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.message.replace("Firebase: ", ""));
    } finally {
      setPwSaving(false);
    }
  };

  const handleTogglePrivacy = async () => {
    const next = !shareContactInfo;
    setShareContactInfo(next);
    setSavingPrivacy(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        privacySettings: { shareContactInfo: next },
      });
    } catch (err) {
      console.error("Failed to save privacy setting:", err);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      const profileData = snap.exists() ? snap.data() : {};
      const historyQ = query(collection(db, "users", currentUser.uid, "loginHistory"), orderBy("timestamp", "desc"), limit(50));
      const historySnap = await getDocs(historyQ);
      const history = historySnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const exportData = {
        profile: { ...profileData, createdAt: profileData.createdAt?.toDate?.()?.toISOString() || null },
        loginHistory: history.map(h => ({ ...h, timestamp: h.timestamp?.toDate?.()?.toISOString() || null })),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `my-care-data-${currentUser.uid}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (deleteConfirmText !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm.');
      return;
    }
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm.");
      return;
    }
    setDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(auth.currentUser);
      // AuthGate will detect the signed-out state automatically and show the login screen.
    } catch (err) {
      setDeleteError(err.message.replace("Firebase: ", ""));
      setDeleting(false);
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
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Privacy & Security</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        <div style={{ marginTop: 10 }}>

          {/* Change Password */}
          <SectionCard>
            <RowHeader
              icon={Lock} fg="#2F6FE0" bg="#E5EFFC" title="Change Password"
              expanded={openSection === "password"} onClick={() => toggleSection("password")}
            />
            {openSection === "password" && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Current password" style={inputStyle} />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password" style={inputStyle} />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" style={inputStyle} />
                {pwError && <div style={{ color: "#E0435A", fontSize: 12 }}>{pwError}</div>}
                {pwSuccess && <div style={{ color: GREEN, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={14} /> {pwSuccess}</div>}
                <button onClick={handleChangePassword} disabled={pwSaving} style={{
                  background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0",
                  fontWeight: 700, fontSize: 13.5, cursor: "pointer", opacity: pwSaving ? 0.7 : 1
                }}>
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </SectionCard>

          {/* 2FA - not available yet */}
          <SectionCard>
            <RowHeader
              icon={ShieldCheck} fg="#8B8D86" bg="#F0F1EC" title="Two-Factor Authentication"
              disabled disabledNote="Needs a paid Firebase plan with SMS support — not available yet"
            />
          </SectionCard>

          {/* Manage devices - not available yet */}
          <SectionCard>
            <RowHeader
              icon={Monitor} fg="#8B8D86" bg="#F0F1EC" title="Manage Login Devices"
              disabled disabledNote="Needs a backend service to track sessions — not built yet"
            />
          </SectionCard>

          {/* Login history - real */}
          <SectionCard>
            <RowHeader
              icon={Clock} fg="#E08A20" bg="#FDF0DF" title="View Login History"
              expanded={openSection === "history"} onClick={() => toggleSection("history")}
            />
            {openSection === "history" && (
              <div style={{ marginTop: 14 }}>
                {loadingHistory ? (
                  <div style={{ fontSize: 12.5, color: "#8B8D86" }}>Loading...</div>
                ) : loginHistory.length === 0 ? (
                  <div style={{ fontSize: 12.5, color: "#6b6d66" }}>No history recorded yet.</div>
                ) : (
                  loginHistory.map((h, i) => (
                    <div key={h.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                      borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", background: GREEN, flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{h.event}</div>
                        <div style={{ fontSize: 10.5, color: "#8B8D86" }}>
                          {h.timestamp?.toDate ? h.timestamp.toDate().toLocaleString() : "Just now"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </SectionCard>

          {/* Privacy settings - real toggle */}
          <SectionCard>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "#EFEAFB",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Eye size={16} color="#6E4FD1" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>Share contact info with connections</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86", marginTop: 2 }}>
                  Lets people connected via your CARE ID see your phone/email
                </div>
              </div>
              <button
                onClick={handleTogglePrivacy}
                disabled={savingPrivacy}
                style={{
                  width: 40, height: 23, borderRadius: 999, border: "none", cursor: "pointer",
                  background: shareContactInfo ? GREEN : "#e2e3dd", position: "relative", flexShrink: 0
                }}
              >
                <div style={{
                  width: 17, height: 17, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3, left: shareContactInfo ? 20 : 3, transition: "left 0.15s"
                }} />
              </button>
            </div>
          </SectionCard>

          {/* Download data - real */}
          <SectionCard>
            <button onClick={handleDownloadData} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none",
              border: "none", cursor: "pointer", padding: 0, textAlign: "left"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Download size={16} color={GREEN} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>Download Personal Data</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86", marginTop: 2 }}>Your profile and login history as a JSON file</div>
              </div>
              <ChevronRight size={16} color="#c7c8c2" />
            </button>
          </SectionCard>

          {/* Logout other devices - not available yet */}
          <SectionCard>
            <RowHeader
              icon={LogOut} fg="#8B8D86" bg="#F0F1EC" title="Logout From Other Devices"
              disabled disabledNote="Needs a backend service to revoke sessions — not built yet"
            />
          </SectionCard>

          {/* Delete account - real */}
          <SectionCard>
            <RowHeader
              icon={Trash2} fg="#E0435A" bg="#FCE9EB" title="Delete Account"
              expanded={openSection === "delete"} onClick={() => toggleSection("delete")}
            />
            {openSection === "delete" && (
              <div style={{ marginTop: 14 }}>
                <div style={{ background: "#FCE9EB", borderRadius: 10, padding: 12, fontSize: 12, color: "#E0435A", marginBottom: 12, lineHeight: 1.5 }}>
                  This permanently deletes your account and profile data. This can't be undone.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                    placeholder="Enter your password" style={inputStyle} />
                  <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder='Type "DELETE" to confirm' style={inputStyle} />
                  {deleteError && <div style={{ color: "#E0435A", fontSize: 12 }}>{deleteError}</div>}
                  <button onClick={handleDeleteAccount} disabled={deleting} style={{
                    background: "#E0435A", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0",
                    fontWeight: 700, fontSize: 13.5, cursor: "pointer", opacity: deleting ? 0.7 : 1
                  }}>
                    {deleting ? "Deleting..." : "Permanently Delete Account"}
                  </button>
                </div>
              </div>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
