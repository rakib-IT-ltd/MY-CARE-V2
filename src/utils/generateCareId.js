import { getInitialsFrom } from "./helpers";

export function generateCareId(name) {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `CARE-${digits}-${getInitialsFrom(name)}`;
}
