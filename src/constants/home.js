import {
  BedDouble, GraduationCap, HeartPulse, Wallet, ClipboardCheck, Briefcase, Users, Moon,
  Wallet2, Pill, ListTodo, StickyNote, Utensils, BookOpen, Rocket,
} from "lucide-react";

export const services = [
  { key: "hostel", name: "Hostel", sub: "Manage hostel", icon: BedDouble, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "school", name: "School", sub: "Study & result", icon: GraduationCap, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "health", name: "Health", sub: "Track health", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "finance", name: "Finance", sub: "Income & expense", icon: Wallet, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "daily-task", name: "Daily Task", sub: "Plan your day", icon: ClipboardCheck, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "travel", name: "Travel", sub: "Tour & trip", icon: Briefcase, bg: "#E3F4F8", fg: "#1CA6C2" },
  { key: "family", name: "Family Tree", sub: "Stay connected", icon: Users, bg: "#E7F3E6", fg: "#4C9A3E" },
  { key: "prayer", name: "Prayer", sub: "Salah & reminder", icon: Moon, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "career", name: "Career Hub", sub: "CV, jobs & AI tools", icon: Rocket, bg: "#E4F3EA", fg: "#1F8A5A" },
];

export const quickActions = [
  { key: "expense", name: "Expense", icon: Wallet2, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "medicine", name: "Medicine", icon: Pill, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "task", name: "Task", icon: ListTodo, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "note", name: "Note", icon: StickyNote, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "trip", name: "Trip", icon: Briefcase, bg: "#E5EFFC", fg: "#2F6FE0" },
];

export const activity = [
  { key: "meal", icon: Utensils, bg: "#E4F3EA", fg: "#1F8A5A", title: "Meal submitted for Lunch", meta: "Hostel · Today, 12:30 PM" },
  { key: "homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0", title: "Homework added", meta: "School · Today, 10:15 AM" },
  { key: "bp", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A", title: "Blood Pressure recorded", meta: "Health · Today, 08:40 AM" },
  { key: "expense2", icon: Wallet2, bg: "#FDF0DF", fg: "#E08A20", title: "Expense added", meta: "Finance · Yesterday, 09:20 PM" },
];