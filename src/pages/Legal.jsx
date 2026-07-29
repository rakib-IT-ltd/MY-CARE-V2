import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const DOCS = {
  terms: {
    title: "Terms & Conditions",
    isLegal: true,
    body: [
      "Welcome to My Care. By creating an account and using this app, you agree to these terms.",
      "Your account: You're responsible for keeping your login credentials secure. Your CARE ID is unique to you and cannot be transferred or edited.",
      "Connecting with others: Features like Family Tree, Hostel, Travel, and School let you connect with other users via your CARE ID. Both sides must accept a connection before any data is shared between accounts.",
      "Acceptable use: Don't use My Care to harass others, share false information, or attempt to access accounts that aren't yours.",
      "Changes: We may update these terms as the app evolves. Continued use after an update means you accept the revised terms.",
      "Termination: You can delete your account at any time from Profile → Privacy & Security. We may suspend accounts that violate these terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    isLegal: true,
    body: [
      "This policy explains what information My Care collects and how it's used.",
      "Information we store: your name, email, CARE ID, and any profile details you choose to add (date of birth, gender, blood group, occupation, address, emergency contact).",
      "Section data: information you add to Hostel, Family, Travel, School, Health, Finance, and Prayer is stored under your account and shared only with people you've explicitly connected with via CARE ID.",
      "Your controls: you can review, export, or delete your data at any time from Profile → Privacy & Security, including a full data download and permanent account deletion.",
      "Third parties: My Care uses Firebase (Google) for authentication and data storage. We don't sell your data to advertisers.",
      "Contact: if you have questions about your data, use Help & Support → Contact Support.",
    ],
  },
  about: {
    title: "About My Care",
    isLegal: false,
    body: [
      "My Care is an all-in-one app built around a single idea: one identity — your CARE ID — that connects you across every part of life that matters.",
      "Hostel for managing student living, School for tracking classes and results, Family Tree for staying connected with relatives, Travel for planning trips and splitting costs, Health for tracking vitals, Finance for managing money, Prayer for spiritual consistency, and Career Hub for building your professional future.",
      "Every section uses the same CARE ID, so connecting with a family member, a hostel manager, or a travel companion works the same way everywhere.",
      "My Care is under active development — new features and real functionality are added section by section.",
    ],
  },
};

export default function LegalPage() {
  const navigate = useNavigate();
  const { doc } = useParams();
  const content = DOCS[doc] || DOCS.about;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>{content.title}</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 24px" }}>
        {content.isLegal && (
          <div style={{
            background: "#FDF6E9", border: "1px solid #F5E7C4", borderRadius: 12, padding: 12,
            marginTop: 10, marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start"
          }}>
            <AlertTriangle size={16} color="#E08A20" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 11.5, color: "#6b6d66", lineHeight: 1.5 }}>
              This is placeholder text for development purposes. Before real users rely on this app,
              have an actual lawyer review and finalize this document.
            </div>
          </div>
        )}

        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 18, marginTop: content.isLegal ? 0 : 10 }}>
          {content.body.map((para, i) => (
            <p key={i} style={{
              fontSize: 13, color: "#1A1A1A", lineHeight: 1.7,
              marginTop: i === 0 ? 0 : 14, marginBottom: 0
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
