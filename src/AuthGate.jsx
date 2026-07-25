import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "./firebase/auth";
import { db } from "./firebase/firestore";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { getInitialsFrom } from "./utils/helpers";
import { generateCareId } from "./utils/generateCareId";

const GREEN = "#1F8A5A";
const GREEN_DARK = "#166B45";

function AuthForm({ mode, onSwitchMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name.");
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        const careId = generateCareId(name);
        await setDoc(doc(db, "users", cred.user.uid), {
          name: name.trim(),
          email,
          careId,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: 700, background: "#fff",
      borderRadius: 28, border: "1px solid #e7e8e2", padding: "50px 28px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr"
        }}>
          <div style={{ background: "#F2A93B", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>C</div>
          <div style={{ background: "#22B573", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>A</div>
          <div style={{ background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>R</div>
          <div style={{ background: "#1CA6C2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>E</div>
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#1A1A1A" }}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p style={{ margin: 0, fontSize: 12.5, color: "#6b6d66" }}>
          {mode === "signup" ? "Get your unique CARE ID and join every section." : "Log in with your CARE account."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "signup" && (
          <input
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
            style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 14 }}
          />
        )}
        <input
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required
          style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 14 }}
        />
        <input
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required minLength={6}
          style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #ECEDE8", fontSize: 14 }}
        />
        {error && <div style={{ color: "#E0435A", fontSize: 12.5 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{
          background: GREEN_DARK, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0",
          fontWeight: 700, fontSize: 14.5, cursor: "pointer", opacity: loading ? 0.7 : 1
        }}>
          {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Log In"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#6b6d66" }}>
        {mode === "signup" ? (
          <>Already have an account?{" "}
            <button onClick={() => onSwitchMode("login")} style={{ background: "none", border: "none", color: GREEN, fontWeight: 600, cursor: "pointer" }}>Log in</button>
          </>
        ) : (
          <>New here?{" "}
            <button onClick={() => onSwitchMode("signup")} style={{ background: "none", border: "none", color: GREEN, fontWeight: 600, cursor: "pointer" }}>Create an account</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const [status, setStatus] = useState("loading"); // loading | signedOut | signedIn
  const [mode, setMode] = useState("signup");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setCurrentUser(null);
        setStatus("signedOut");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        const data = snap.exists() ? snap.data() : {};
        const name = data.name || fbUser.displayName || "New User";
        setCurrentUser({
          uid: fbUser.uid,
          name,
          email: data.email || fbUser.email,
          careId: data.careId || "CARE-00000-NA",
          initials: getInitialsFrom(name),
        });
        setStatus("signedIn");
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setStatus("signedOut");
      }
    });
    return () => unsub();
  }, []);

  if (status === "loading") {
    return (
      <div style={{
        maxWidth: 420, margin: "0 auto", minHeight: 700, display: "flex",
        alignItems: "center", justifyContent: "center", color: "#8B8D86", fontFamily: "sans-serif"
      }}>
        Loading...
      </div>
    );
  }

  if (status === "signedOut") {
    return <AuthForm mode={mode} onSwitchMode={setMode} />;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}
