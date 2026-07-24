import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export { auth };

export function signOutUser() {
  return signOut(auth);
}
