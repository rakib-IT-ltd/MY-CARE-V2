import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { GREEN, GREEN_DARK } from "../constants/colors";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FieldLabel({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "#6b6d66", marginBottom: 6 }}>{children}</div>;
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #ECEDE8",
  fontSize: 13.5, boxSizing: "border-box", background: "#fff", color: "#1A1A1A",
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [name, setName] = useState(currentUser?.name || "");
  const [dob, setDob] = useState(currentUser?.dob || "");
  const [gender, setGender] = useState(currentUser?.gender || "");
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || "");
  const [occupation, setOccupation] = useState(currentUser?.occupation || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || "");

  const [saving, setSaving] = useState(false);
  const [savedNote, setSavedNote] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Full name can't be empty.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: name.trim(),
        dob,
        gender,
        bloodGroup,
        occupation: occupation.trim(),
        address: address.trim(),
        emergencyContact: emergencyContact.trim(),
      });
      if (auth.currentUser && auth.currentUser.displayName !== name.trim()) {
        await updateAuthProfile(auth.currentUser, { displayName: name.trim() });
      }
      await currentUser.refreshProfile();
      setSavedNote("Profile updated!");
      setTimeout(() => navigate(-1), 700);
    } catch (err) {
      setError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
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
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Edit Profile</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <FieldLabel>Date of Birth</FieldLabel>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <FieldLabel>Gender</FieldLabel>
            <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <FieldLabel>Blood Group</FieldLabel>
            <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <FieldLabel>Occupation</FieldLabel>
            <input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Software Engineer" style={inputStyle} />
          </div>

          <div>
            <FieldLabel>Address</FieldLabel>
            <textarea
              value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address"
              rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <FieldLabel>Emergency Contact</FieldLabel>
            <input
              value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)}
              placeholder="Name and phone number" style={inputStyle}
            />
          </div>

          <div style={{ background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 10, padding: 12, fontSize: 11.5, color: "#8B8D86" }}>
            Your CARE ID and account creation date can't be changed here.
          </div>

          {error && <div style={{ color: "#E0435A", fontSize: 12.5 }}>{error}</div>}

          <button onClick={handleSave} disabled={saving} style={{
            background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 12, padding: "13px 0",
            fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: saving ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <CheckCircle2 size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          {savedNote && <div style={{ color: GREEN, fontSize: 12.5, textAlign: "center" }}>{savedNote}</div>}
        </div>
      </div>
    </div>
  );
}
