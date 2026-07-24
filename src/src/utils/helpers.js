export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function slugify(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getInitialsFrom(name) {
  if (!name) return "NA";
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
