import { createContext, useContext } from "react";

// Shape of the value provided: { uid, name, email, careId, initials } | null
export const CurrentUserContext = createContext(null);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
