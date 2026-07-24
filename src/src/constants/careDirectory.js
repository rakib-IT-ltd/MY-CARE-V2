export const CARE_ID = "CARE-48291-RH";

// Mock directory simulating other users' accounts by CARE ID — used only in
// sections not yet wired to real Firestore lookups (Family, Travel, School).
// Try: CARE-58213-AH, CARE-77120-KJ, CARE-90344-NJ
export const CARE_DIRECTORY = {
  "CARE-58213-AH": { name: "Ayesha Hasan", phone: "+880 1734-221190", initials: "AH", bg: "#FCE9EB", fg: "#E0435A" },
  "CARE-77120-KJ": { name: "Karim Uddin", phone: "+880 1912-556234", initials: "KU", bg: "#E5EFFC", fg: "#2F6FE0" },
  "CARE-90344-NJ": { name: "Nusrat Jahan", phone: "+880 1655-887123", initials: "NJ", bg: "#EFEAFB", fg: "#6E4FD1" },
};
