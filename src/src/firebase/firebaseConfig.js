// Firebase project configuration.
//
// HOW TO GET YOUR OWN VALUES:
// 1. Go to https://console.firebase.google.com
// 2. Create a project (free tier is fine)
// 3. Click the "</>" (web app) icon to register a web app
// 4. Firebase will show you a config object like the one below — copy your
//    real values in and replace every "YOUR_..." placeholder here.
// 5. In the Firebase Console, go to Build > Authentication > Sign-in method
//    and enable "Email/Password".
// 6. Go to Build > Firestore Database > Create database (start in test mode
//    for now — we'll tighten security rules later).

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
