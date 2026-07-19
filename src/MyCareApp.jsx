import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { useCurrentUser } from "./CurrentUserContext";
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc,
  query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import {
  Menu, Search, Bell, Plus, ChevronRight, ChevronDown, Home as HomeIcon,
  User, BedDouble, GraduationCap, HeartPulse, Wallet,
  ClipboardCheck, Briefcase, Users, Moon, Wallet2, Pill,
  ListTodo, StickyNote, Star, Info, Trophy, ArrowRight, Utensils, BookOpen,
  ArrowLeft, MoreHorizontal, Droplet, Stethoscope, Scale, Thermometer,
  Lightbulb, Footprints, GlassWater, UserRound, Smile, TreePine, UserPlus,
  NotebookPen, Image, Gift, Heart, Calendar, ShieldCheck, Share2,
  Sun, Waves, Radio, Pencil, Building2, Bus, List, Receipt, CheckSquare,
  MapPin, MessageCircle, CheckCircle2, Car, Backpack, Plane, Sunrise, DoorOpen,
  UserCog, CreditCard, Banknote, ArrowLeftRight, SquarePen, Sunset, Clock, Coins,
  BarChart3, Library, Megaphone, FileText, UploadCloud, MessageSquare, Truck, School,
  ArrowDown, ArrowUp, PiggyBank, PieChart as PieChartIcon, Target, Zap, Wifi, ShoppingBag,
  XCircle, Landmark, Copy, Settings, HelpCircle, LogOut, Shield, X, Phone, Mail
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const GREEN = "#1F8A5A";
const GREEN_DARK = "#166B45";

function CareLogo({ size = 34 }) {
  const letters = [
    { ch: "C", bg: "#F2A93B" },
    { ch: "A", bg: "#22B573" },
    { ch: "R", bg: "#3B82F6" },
    { ch: "E", bg: "#1CA6C2" },
  ];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, overflow: "hidden",
      display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
      flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
    }}>
      {letters.map(l => (
        <div key={l.ch} style={{
          background: l.bg, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: size * 0.34, lineHeight: 1
        }}>{l.ch}</div>
      ))}
    </div>
  );
}

const services = [
  { key: "hostel", name: "Hostel", sub: "Manage hostel", icon: BedDouble, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "school", name: "School", sub: "Study & result", icon: GraduationCap, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "health", name: "Health", sub: "Track health", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "finance", name: "Finance", sub: "Income & expense", icon: Wallet, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "daily-task", name: "Daily Task", sub: "Plan your day", icon: ClipboardCheck, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "travel", name: "Travel", sub: "Tour & trip", icon: Briefcase, bg: "#E3F4F8", fg: "#1CA6C2" },
  { key: "family", name: "Family Tree", sub: "Stay connected", icon: Users, bg: "#E7F3E6", fg: "#4C9A3E" },
  { key: "prayer", name: "Prayer", sub: "Salah & reminder", icon: Moon, bg: "#EFEAFB", fg: "#6E4FD1" },
];

const quickActions = [
  { key: "expense", name: "Expense", icon: Wallet2, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "medicine", name: "Medicine", icon: Pill, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "task", name: "Task", icon: ListTodo, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "note", name: "Note", icon: StickyNote, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "trip", name: "Trip", icon: Briefcase, bg: "#E5EFFC", fg: "#2F6FE0" },
];

const activity = [
  { key: "meal", icon: Utensils, bg: "#E4F3EA", fg: "#1F8A5A", title: "Meal submitted for Lunch", meta: "Hostel · Today, 12:30 PM" },
  { key: "homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0", title: "Homework added", meta: "School · Today, 10:15 AM" },
  { key: "bp", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A", title: "Blood Pressure recorded", meta: "Health · Today, 08:40 AM" },
  { key: "expense2", icon: Wallet2, bg: "#FDF0DF", fg: "#E08A20", title: "Expense added", meta: "Finance · Yesterday, 09:20 PM" },
];

const vitals = [
  { key: "hr", name: "Heart Rate", value: "72", unit: "bpm", status: "Normal", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "sugar", name: "Blood Sugar", value: "5.6", unit: "mmol/L", status: "Normal", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "bp", name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "weight", name: "Weight", value: "68.5", unit: "kg", status: "Healthy", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
];

const addReadings = [
  { key: "bp", name: "Blood Pressure", sub: "Track your BP", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "sugar", name: "Blood Sugar", sub: "Track your sugar level", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "weight", name: "Weight", sub: "Track your weight", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hr", name: "Heart Rate", sub: "Track your heart rate", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "spo2", name: "SpO2", sub: "Track your oxygen level", icon: Droplet, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "temp", name: "Body Temperature", sub: "Track your temperature", icon: Thermometer, bg: "#FDF0DF", fg: "#E08A20" },
];

const heartRateData = [
  { day: "Mon", bpm: 74 }, { day: "Tue", bpm: 78 }, { day: "Wed", bpm: 70 },
  { day: "Thu", bpm: 72 }, { day: "Fri", bpm: 76 }, { day: "Sat", bpm: 71 }, { day: "Sun", bpm: 79 },
];

const recentReadings = [
  { key: "bp", name: "Blood Pressure", value: "120/80 mmHg", meta: "Today, 8:30 AM", icon: Stethoscope, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "sugar", name: "Blood Sugar", value: "5.6 mmol/L", meta: "Today, 8:20 AM", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "weight", name: "Weight", value: "68.5 kg", meta: "Yesterday, 7:45 AM", icon: Scale, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hr", name: "Heart Rate", value: "72 bpm", meta: "Yesterday, 7:40 AM", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
];

const initialReminders = [
  { key: "med", name: "Medicine", sub: "Vitamin D – 1 tablet · Today, 9:00 AM", icon: Pill, bg: "#FCE9EB", fg: "#E0435A", on: true },
  { key: "water", name: "Drink Water", sub: "Next reminder at 11:00 AM", icon: GlassWater, bg: "#E5EFFC", fg: "#2F6FE0", on: true },
  { key: "walk", name: "Morning Walk", sub: "Daily goal: 30 minutes", icon: Footprints, bg: "#E4F3EA", fg: "#1F8A5A", on: false },
];

const familyStats = [
  { key: "total", label: "Family Members", sub: "All connected", value: "12", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "male", label: "Male Members", sub: "In your family", value: "5", icon: User, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "female", label: "Female Members", sub: "In your family", value: "7", icon: UserRound, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "children", label: "Children", sub: "Our little stars", value: "4", icon: Smile, bg: "#FDF0DF", fg: "#E08A20" },
];

const familyQuickActions = [
  { key: "tree", name: "View Tree", sub: "See family tree", icon: TreePine, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "add", name: "Add Member", sub: "Add new member", icon: UserPlus, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "note", name: "Family Note", sub: "Add family note", icon: NotebookPen, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "album", name: "Photo Album", sub: "View memories", icon: Image, bg: "#FDF0DF", fg: "#E08A20" },
];

const familyMembers = [
  { key: "father", name: "Abdul Karim", relation: "Father", dob: "12 Mar 1965", badge: "Head", badgeColor: GREEN, relColor: "#1F8A5A", initials: "AK", avatarBg: "#E4F3EA", avatarFg: "#1F8A5A" },
  { key: "mother", name: "Salma Begum", relation: "Mother", dob: "18 Jul 1968", badge: "Mother", badgeColor: "#C4457B", relColor: "#C4457B", initials: "SB", avatarBg: "#FCE9EB", avatarFg: "#C4457B" },
  { key: "you", name: "Rakib Hasan", relation: "Son", dob: "25 Jan 1998", badge: "You", badgeColor: GREEN, relColor: "#2F6FE0", initials: "RH", avatarBg: "#E4F3EA", avatarFg: "#1F8A5A" },
  { key: "wife", name: "Nusrat Jahan", relation: "Wife", dob: "12 May 1999", badge: "Wife", badgeColor: "#E0435A", relColor: "#E0435A", initials: "NJ", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
  { key: "son", name: "Ahnaf Hasan", relation: "Son", dob: "10 Aug 2018", badge: null, relColor: "#2F6FE0", initials: "AH", avatarBg: "#E5EFFC", avatarFg: "#2F6FE0" },
  { key: "daughter", name: "Ayesha Hasan", relation: "Daughter", dob: "15 Feb 2021", badge: null, relColor: "#E0435A", initials: "AH", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
  { key: "brother", name: "Fahim Hasan", relation: "Brother", dob: "20 Nov 2001", badge: null, relColor: "#2F6FE0", initials: "FH", avatarBg: "#E5EFFC", avatarFg: "#2F6FE0" },
  { key: "sister", name: "Farhana Hasan", relation: "Sister", dob: "05 Apr 2004", badge: null, relColor: "#E0435A", initials: "FH", avatarBg: "#FCE9EB", avatarFg: "#E0435A" },
];

const upcomingBirthdays = [
  { key: "ahnaf", name: "Ahnaf Hasan", meta: "10 Aug (in 15 days)", initials: "AH", bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "nusrat", name: "Nusrat Jahan", meta: "12 May (in 56 days)", initials: "NJ", bg: "#FCE9EB", fg: "#E0435A" },
  { key: "karim", name: "Abdul Karim", meta: "12 Mar (in 96 days)", initials: "AK", bg: "#E4F3EA", fg: "#1F8A5A" },
];

const tripStats = [
  { key: "days", icon: Calendar, bg: "#E4F3EA", fg: "#1F8A5A", value: "3", label: "Days Left", sub: "Total Duration" },
  { key: "spent", icon: Wallet2, bg: "#E5EFFC", fg: "#2F6FE0", value: "৳ 4,350", label: "Total Spent", sub: "of ৳ 20,000", progress: 22 },
  { key: "travelers", icon: Users, bg: "#FDEFE4", fg: "#E08A20", value: "10", label: "Travelers", sub: "All Connected" },
  { key: "hotel", icon: Building2, bg: "#EFEAFB", fg: "#6E4FD1", value: "Sea View Hotel", label: "Check-in", sub: "18 Dec, 2:30 PM" },
  { key: "bus", icon: Bus, bg: "#FDF0DF", fg: "#E08A20", value: "Green Line", label: "Bus", sub: "08:00 AM" },
];

const tripTabs = [
  { key: "itinerary", name: "Itinerary", icon: List },
  { key: "expenses", name: "Expenses", icon: Receipt },
  { key: "members", name: "Members", icon: Users },
  { key: "checklists", name: "Checklists", icon: CheckSquare },
  { key: "bookings", name: "Bookings", icon: Briefcase },
  { key: "more", name: "More", icon: MoreHorizontal },
];

const recentExpenses = [
  { key: "water", name: "Water (10 bottle)", meta: "Today, 09:30 AM", amount: "৳ 100", paidBy: "Paid by You", icon: Droplet, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "lunch", name: "Lunch at Poushee", meta: "Today, 01:45 PM", amount: "৳ 2,100", paidBy: "Paid by Karim", icon: Utensils, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "taxi", name: "Taxi to Himchari", meta: "Today, 04:10 PM", amount: "৳ 350", paidBy: "Paid by Rahim", icon: Car, bg: "#E4F3EA", fg: "#1F8A5A" },
];

const memberBalances = [
  { key: "you", name: "You", initials: "RH", amount: "৳ 870", status: "Will receive", positive: true, highlight: true },
  { key: "karim", name: "Karim", initials: "K", amount: "৳ 250", status: "Will receive", positive: true },
  { key: "hasan", name: "Hasan", initials: "H", amount: "৳ 370", status: "Owes you", positive: false },
  { key: "rahim", name: "Rahim", initials: "R", amount: "৳ 420", status: "Owes you", positive: false },
  { key: "rafi", name: "Rafi", initials: "Rf", amount: "৳ 190", status: "Owes you", positive: false },
];

const todayItinerary = [
  { key: "wake", time: "05:30 AM", title: "Wake Up", sub: "Get ready for an amazing trip", icon: Sunrise, fg: "#6E4FD1", done: true },
  { key: "leave", time: "06:30 AM", title: "Leave Home", sub: "Start your journey", icon: DoorOpen, fg: "#1F8A5A", done: true },
  { key: "bus", time: "08:00 AM", title: "Bus Departs", sub: "Green Line, Dhaka → Cox's Bazar", icon: Bus, fg: "#2F6FE0", done: true },
  { key: "reach", time: "02:00 PM", title: "Reach Cox's Bazar", sub: "Check-in at hotel", icon: MapPin, fg: "#E0435A", done: true },
  { key: "lunch2", time: "03:30 PM", title: "Lunch", sub: "Poushee Restaurant", icon: Utensils, fg: "#E08A20", done: true },
];

const placesToVisit = [
  { key: "laboni", name: "Laboni Beach", bg: "linear-gradient(135deg,#8FD3E8,#F5D69B)" },
  { key: "marine", name: "Marine Drive", bg: "linear-gradient(135deg,#A7C5EB,#7FA6C9)" },
  { key: "himchari", name: "Himchari", bg: "linear-gradient(135deg,#9FCB8F,#5E9BB0)" },
];

const tripChat = [
  { key: "karim", name: "Karim", initials: "K", msg: "We will reach hotel in 30 mins.", time: "02:15 PM", badge: 2 },
  { key: "rahim", name: "Rahim", initials: "R", msg: "Lunch at 1:30 PM. Everyone be ready.", time: "01:45 PM" },
];

const CARE_ID = "CARE-48291-RH";

// Mock directory simulating other users' accounts by CARE ID — in a real backend
// this lookup would hit a server. Try: CARE-58213-AH, CARE-77120-KJ, CARE-90344-NJ
const CARE_DIRECTORY = {
  "CARE-58213-AH": { name: "Ayesha Hasan", phone: "+880 1734-221190", initials: "AH", bg: "#FCE9EB", fg: "#E0435A" },
  "CARE-77120-KJ": { name: "Karim Uddin", phone: "+880 1912-556234", initials: "KU", bg: "#E5EFFC", fg: "#2F6FE0" },
  "CARE-90344-NJ": { name: "Nusrat Jahan", phone: "+880 1655-887123", initials: "NJ", bg: "#EFEAFB", fg: "#6E4FD1" },
};

const managerStats = [
  { key: "students", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A", value: "186", label: "Students", sub: "Active" },
  { key: "rooms", icon: BedDouble, bg: "#E5EFFC", fg: "#2F6FE0", value: "69 / 86", label: "Rooms", sub: "Occupied / Total" },
  { key: "due", icon: Coins, bg: "#FDF0DF", fg: "#E08A20", value: "৳ 35,400", label: "Outstanding Due", sub: "All Students" },
  { key: "guests", icon: UserRound, bg: "#EFEAFB", fg: "#6E4FD1", value: "12", label: "Guests Today", sub: "Current Guests" },
];

const mealsSummary = [
  { key: "breakfast", icon: Sun, fg: "#1F8A5A", value: "120", label: "Breakfast" },
  { key: "lunch", icon: Sun, fg: "#2F6FE0", value: "128", label: "Lunch" },
  { key: "dinner", icon: Moon, fg: "#E08A20", value: "115", label: "Dinner" },
  { key: "total", icon: CheckCircle2, fg: "#1F8A5A", value: "363", label: "Total" },
];

const menuToday = [
  { key: "breakfast", name: "Breakfast", items: 2, icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", items: 3, icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", items: 3, icon: Moon, fg: "#E08A20" },
];

const recentActivities = [
  { key: "menu", title: "Menu updated for Lunch", meta: "Today, 10:30 AM", icon: Utensils, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "student", title: "New student added", meta: "Today, 09:15 AM", icon: UserPlus, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "payment", title: "Payment received from Abir Hossain", meta: "Today, 08:40 AM", icon: Coins, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "checkin", title: "Guest check-in by Rakib Hasan", meta: "Today, 08:20 AM", icon: UserRound, bg: "#EFEAFB", fg: "#6E4FD1" },
];

const managerTabs = [
  { key: "dashboard", name: "Dashboard", icon: HomeIcon },
  { key: "students", name: "Students", icon: Users },
  { key: "meals", name: "Meals", icon: Utensils },
  { key: "rent", name: "Rent", icon: Banknote },
  { key: "reports", name: "Reports", icon: Receipt },
];

const studentTopStats = [
  { key: "room", icon: BedDouble, bg: "#E4F3EA", fg: "#1F8A5A", value: "102", label: "My Room", sub: "Bed 2" },
  { key: "plan", icon: Utensils, bg: "#E5EFFC", fg: "#2F6FE0", value: "3 / Day", label: "Meal Plan", sub: "B, L, D" },
  { key: "rent", icon: Banknote, bg: "#FDF0DF", fg: "#E08A20", value: "৳ 4,000", label: "Monthly Rent", sub: "Due on 5 Jul 2025" },
  { key: "due", icon: Coins, bg: "#EFEAFB", fg: "#6E4FD1", value: "৳ 0", label: "Due Amount", sub: "All Paid" },
];

const studentMeals = [
  { key: "breakfast", name: "Breakfast", time: "7:30 AM - 9:00 AM", items: "Egg, Bread, Tea, Banana +1 more", status: "Completed", statusColor: "#1F8A5A", statusBg: "#E4F3EA", icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", time: "12:30 PM - 2:00 AM", items: "Rice, Dal, Fish, Vegetable +2 more", status: "Upcoming", statusColor: "#2F6FE0", statusBg: "#E5EFFC", icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", time: "7:30 PM - 9:00 PM", items: "Rice, Chicken Curry, Vegetable +1 more", status: "Upcoming", statusColor: "#E08A20", statusBg: "#FDF0DF", icon: Moon, fg: "#E08A20" },
];

const studentMenu = [
  { key: "breakfast", name: "Breakfast", items: 4, icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", items: 4, icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", items: 4, icon: Moon, fg: "#E08A20" },
];

const studentNotices = [
  { key: "meeting", title: "Hostel meeting", body: "A general meeting will be held on 20 June 2025 at 7:00 PM.", meta: "17 Jun 2025 · 09:00 AM", icon: Star, bg: "#FDF6E9", border: "#F5E7C4", fg: "#E08A20" },
  { key: "rent", title: "Rent collection", body: "Please collect the pending rent from all students by the end of this month.", meta: "16 Jun 2025 · 04:30 PM", icon: Info, bg: "#EAF1FC", border: "#D3E2F7", fg: "#2F6FE0" },
];

const studentTabs = [
  { key: "dashboard", name: "Dashboard", icon: HomeIcon },
  { key: "meals", name: "My Meals", icon: Utensils },
  { key: "rent", name: "My Rent", icon: Banknote },
  { key: "guests", name: "My Guests", icon: Users },
  { key: "profile", name: "Profile", icon: User },
];

// ---- School section data ----
const schStudentClasses = [
  { key: "eng", time: "08:00 AM", name: "English", room: "Room 101", icon: BookOpen, fg: "#6E4FD1" },
  { key: "math", time: "09:00 AM", name: "Math", room: "Room 102", icon: BarChart3, fg: "#2F6FE0" },
  { key: "sci", time: "10:30 AM", name: "Science", room: "Lab 1", icon: Thermometer, fg: "#E08A20" },
  { key: "ict", time: "11:30 AM", name: "ICT", room: "Room 203", icon: MessageSquare, fg: "#1F8A5A" },
  { key: "bangla", time: "01:00 PM", name: "Bangla", room: "Room 104", icon: BookOpen, fg: "#E0435A" },
];

const schStudentProgress = [
  { key: "attendance", icon: ShieldCheck, fg: "#1F8A5A", label: "Attendance", value: "90%" },
  { key: "homework", icon: BookOpen, fg: "#2F6FE0", label: "Homework", value: "2 Pending" },
  { key: "tests", icon: FileText, fg: "#E08A20", label: "Tests", value: "1 Upcoming" },
  { key: "marks", icon: BarChart3, fg: "#6E4FD1", label: "Average Marks", value: "85%" },
];

const schStudentQuickAccess = [
  { key: "homework", name: "Homework", icon: BookOpen, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "library", name: "Library", icon: Library, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schStudentUpdates = [
  { key: "hw", text: "Math homework is due tomorrow", meta: "Yesterday" },
  { key: "closed", text: "School will remain closed on 25 May", meta: "08:30 AM" },
  { key: "test", text: "Science test on Chapter 5 on 22 May", meta: "Yesterday" },
];

const schChildOverview = [
  { key: "attendance", icon: ShieldCheck, fg: "#1F8A5A", bg: "#E4F3EA", label: "Attendance", value: "96%", sub: "This Month" },
  { key: "homework", icon: BookOpen, fg: "#2F6FE0", bg: "#E5EFFC", label: "Homework", value: "", sub: "" },
  { key: "marks", icon: BarChart3, fg: "#E08A20", bg: "#FDF0DF", label: "Average Marks", value: "88%", sub: "" },
  { key: "behavior", icon: Smile, fg: "#6E4FD1", bg: "#EFEAFB", label: "Behavior", value: "Excellent", sub: "" },
];

const schTodayAtSchool = [
  { key: "eng", time: "08:00 AM", name: "English", status: "Completed", color: "#1F8A5A" },
  { key: "math", time: "09:00 AM", name: "Math", status: "Ongoing", color: "#2F6FE0" },
  { key: "sci", time: "10:30 AM", name: "Science", status: "Upcoming", color: "#8B8D86" },
];

const schParentQuickAccess = [
  { key: "childprogress", name: "Child Progress", icon: BarChart3, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "homework", name: "Homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "examsched", name: "Exam Schedule", icon: Calendar, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "results", name: "Results", icon: Trophy, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schParentUpdates = [
  { key: "meeting", text: "Parents meeting on 24 May at 10:00 AM", meta: "2h ago" },
  { key: "hw", text: "Math homework is due tomorrow", meta: "Yesterday" },
  { key: "fee", text: "Monthly fee for May is paid", meta: "2 May" },
];

const schTeacherSchedule = [
  { key: "c9a", time: "08:00 AM", name: "Class 9A", room: "Room 102" },
  { key: "c8b", time: "09:00 AM", name: "Class 8B", room: "Room 102" },
  { key: "c7a", time: "10:30 AM", name: "Class 7A", room: "Room 102" },
  { key: "c10a", time: "01:00 PM", name: "Class 10A", room: "Room 102" },
];

const schTeacherStats = [
  { key: "classes", icon: BookOpen, fg: "#2F6FE0", bg: "#E5EFFC", value: "4", label: "Classes" },
  { key: "students", icon: Users, fg: "#1F8A5A", bg: "#E4F3EA", value: "128", label: "Students" },
  { key: "attendance", icon: ShieldCheck, fg: "#E08A20", bg: "#FDF0DF", value: "92%", label: "Attendance" },
  { key: "pending", icon: ClipboardCheck, fg: "#6E4FD1", bg: "#EFEAFB", value: "5", label: "Pending Work" },
];

const schTeacherQuickAccess = [
  { key: "takeatt", name: "Take Attendance", icon: ShieldCheck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "assignhw", name: "Assign Homework", icon: BookOpen, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "uploadresult", name: "Upload Result", icon: UploadCloud, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "noticeboard", name: "Notice Board", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "examsched", name: "Exam Schedule", icon: Calendar, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "reports", name: "Reports", icon: Receipt, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "message", name: "Message", icon: MessageSquare, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schTeacherActivities = [
  { key: "hw", text: "Homework assigned to Class 9A", meta: "1h ago" },
  { key: "att", text: "Attendance marked for Class 8B", meta: "2h ago" },
  { key: "result", text: "Result uploaded for Class 7A", meta: "Yesterday" },
];

const schOverviewStats = [
  { key: "students", icon: Users, fg: "#1F8A5A", bg: "#E4F3EA", value: "1,245", label: "Total Students" },
  { key: "teachers", icon: UserRound, fg: "#E08A20", bg: "#FDF0DF", value: "68", label: "Teachers" },
  { key: "attendance", icon: BarChart3, fg: "#2F6FE0", bg: "#E5EFFC", value: "91%", label: "Attendance" },
  { key: "fee", icon: Coins, fg: "#6E4FD1", bg: "#EFEAFB", value: "78%", label: "Fee Collection" },
];

const schAdminQuickAccess = [
  { key: "students", name: "Students", icon: Users, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "teachers", name: "Teachers", icon: UserRound, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "attendance", name: "Attendance", icon: ShieldCheck, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "fees", name: "Fees", icon: Wallet2, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "exams", name: "Exams", icon: FileText, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "results", name: "Results", icon: Trophy, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "notice", name: "Notice", icon: Megaphone, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "library", name: "Library", icon: Library, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "transport", name: "Transport", icon: Truck, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "hostel", name: "Hostel", icon: BedDouble, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "reports", name: "Reports", icon: Receipt, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "more", name: "More", icon: MoreHorizontal, bg: "#F0F1EC", fg: "#6b6d66" },
];

const schAdminUpdates = [
  { key: "fair", text: "Science fair on 30 May 2025", meta: "3h ago" },
  { key: "fee", text: "April fee collection report generated", meta: "5h ago" },
  { key: "admission", text: "New student admission: 12", meta: "Yesterday" },
];

const schAdminSummary = [
  { key: "classes", label: "Classes Running", value: "42" },
  { key: "attendance", label: "Today's Attendance", value: "92%" },
  { key: "teachers", label: "Teachers Present", value: "60" },
  { key: "fee", label: "Pending Fee", value: "৳ 2,45,000" },
];

const schStudentTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "classes", name: "Classes", icon: BookOpen },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schParentTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "child", name: "Child", icon: UserRound },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schTeacherTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "classes", name: "Classes", icon: BookOpen },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];
const schAdminTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "reports", name: "Reports", icon: Receipt },
  { key: "calendar", name: "Calendar", icon: Calendar },
  { key: "profile", name: "Profile", icon: User },
];

// ---- Finance section data ----
const FIN_GREEN = "#1F8A5A";
const FIN_BLUE = "#2F6FE0";
const FIN_ORANGE = "#E08A20";
const FIN_PURPLE = "#6E4FD1";
const FIN_RED = "#E0435A";

const financeStats = [
  { key: "balance", icon: Wallet, bg: "#E4F3EA", fg: FIN_GREEN, label: "Total Balance", value: "৳ 24,580", change: "↗ 8.5% this month", changeColor: FIN_GREEN, changeBg: "#E4F3EA" },
  { key: "income", icon: ArrowDown, bg: "#E5EFFC", fg: FIN_BLUE, label: "Total Income", value: "৳ 38,750", change: "↗ 12.3% vs last month", changeColor: FIN_BLUE, changeBg: "#E5EFFC" },
  { key: "expense", icon: ArrowUp, bg: "#FDF0DF", fg: FIN_ORANGE, label: "Total Expense", value: "৳ 14,170", change: "↗ 5.7% vs last month", changeColor: FIN_ORANGE, changeBg: "#FDF0DF" },
  { key: "savings", icon: PiggyBank, bg: "#EFEAFB", fg: FIN_PURPLE, label: "Total Savings", value: "৳ 12,350", change: "↗ 15.2% vs last month", changeColor: FIN_PURPLE, changeBg: "#EFEAFB" },
];

const financeQuickActions = [
  { key: "income", name: "Income", icon: ArrowDown, fg: FIN_GREEN },
  { key: "expense", name: "Expense", icon: ArrowUp, fg: FIN_RED },
  { key: "transfer", name: "Transfer", icon: ArrowLeftRight, fg: FIN_PURPLE },
  { key: "bills", name: "Bills & Due", icon: FileText, fg: FIN_ORANGE },
  { key: "budget", name: "Budget", icon: PieChartIcon, fg: FIN_BLUE },
];

const incomeExpenseData = [
  { period: "1-7", income: 28000, expense: 20500 },
  { period: "8-14", income: 33500, expense: 18200 },
  { period: "15-21", income: 27200, expense: 19400 },
  { period: "22-28", income: 35800, expense: 22100 },
  { period: "29-31", income: 29400, expense: 17300 },
];

const expenseCategories = [
  { key: "food", name: "Food & Dining", value: 4250, pct: 30, color: FIN_GREEN },
  { key: "transport", name: "Transport", value: 2900, pct: 20, color: FIN_BLUE },
  { key: "shopping", name: "Shopping", value: 2450, pct: 17, color: FIN_PURPLE },
  { key: "bills", name: "Bills & Utilities", value: 2200, pct: 16, color: FIN_ORANGE },
  { key: "others", name: "Others", value: 2370, pct: 17, color: "#9a9c95" },
];

const financeCategoryIcons = {
  food: Utensils, transport: Car, shopping: ShoppingBag, bills: FileText, others: MoreHorizontal,
};

const recentTransactions = [
  { key: "salary", name: "Salary", meta: "Today, 8:30 AM", amount: "+ ৳ 25,000", positive: true },
  { key: "grocery", name: "Grocery Shopping", meta: "Today, 10:15 AM", amount: "− ৳ 1,250", positive: false },
  { key: "electricity", name: "Electricity Bill", meta: "Yesterday, 7:45 PM", amount: "− ৳ 1,850", positive: false },
  { key: "freelance", name: "Freelance Payment", meta: "Yesterday, 5:20 PM", amount: "+ ৳ 8,750", positive: true },
];

const upcomingBills = [
  { key: "electricity", name: "Electricity Bill", meta: "Due in 3 days", amount: "৳ 1,850", status: "Due Soon", statusColor: FIN_RED, statusBg: "#FCE9EB", icon: Zap, fg: FIN_BLUE, bg: "#E5EFFC" },
  { key: "internet", name: "Internet Bill", meta: "Due in 7 days", amount: "৳ 950", status: "Upcoming", statusColor: FIN_ORANGE, statusBg: "#FDF0DF", icon: Wifi, fg: FIN_PURPLE, bg: "#EFEAFB" },
  { key: "water", name: "Water Bill", meta: "Due in 10 days", amount: "৳ 450", status: "Upcoming", statusColor: FIN_ORANGE, statusBg: "#FDF0DF", icon: Droplet, fg: FIN_BLUE, bg: "#E5EFFC" },
];

const financeTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "finance", name: "Finance", icon: Wallet },
  { key: "reports", name: "Reports", icon: BarChart3 },
  { key: "profile", name: "Profile", icon: User },
];

// ---- Prayer section data ----
const prayerOverview = [
  { key: "prayed", icon: CheckCircle2, bg: "#E4F3EA", fg: FIN_GREEN, value: "3", label: "Prayed", sub: "times" },
  { key: "missed", icon: Clock, bg: "#FDF0DF", fg: FIN_ORANGE, value: "2", label: "Missed", sub: "times" },
  { key: "total", icon: Calendar, bg: "#E5EFFC", fg: FIN_BLUE, value: "15", label: "Total Prayers", sub: "times" },
  { key: "accuracy", icon: Target, bg: "#EFEAFB", fg: FIN_PURPLE, value: "60%", label: "Accuracy", sub: "this day" },
];

const yesterdayPrayers = [
  { key: "fajr", name: "Fajr", arabic: "الفجر", time: "4:15 AM", status: "Prayed", icon: Sunrise, bg: "#1F8A5A" },
  { key: "sunrise", name: "Sunrise", arabic: "الشروق", time: "5:34 AM", status: "Missed", icon: Sun, bg: "#E08A20" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر", time: "1:15 PM", status: "Prayed", icon: Sun, bg: "#1F8A5A" },
  { key: "asr", name: "Asr", arabic: "العصر", time: "4:45 PM", status: "Prayed", icon: Sun, bg: "#E08A20" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب", time: "6:55 PM", status: "Missed", icon: Sunset, bg: "#E0435A" },
  { key: "isha", name: "Isha", arabic: "العشاء", time: "8:25 PM", status: "Prayed", icon: Moon, bg: "#1A2B4C" },
];

const weeklyProgress = [
  { key: "mon", day: "Mon", date: "12", ratio: "5/5", pct: 100, color: FIN_GREEN },
  { key: "tue", day: "Tue", date: "13", ratio: "3/5", pct: 60, color: FIN_ORANGE },
  { key: "wed", day: "Wed", date: "14", ratio: "4/5", pct: 80, color: FIN_GREEN },
  { key: "thu", day: "Thu", date: "15", ratio: "2/5", pct: 40, color: FIN_RED },
  { key: "fri", day: "Fri", date: "16", ratio: "5/5", pct: 100, color: FIN_GREEN },
  { key: "sat", day: "Sat", date: "17", ratio: "3/5", pct: 60, color: FIN_ORANGE },
  { key: "sun", day: "Sun", date: "18", ratio: "3/5", pct: 60, color: FIN_ORANGE, active: true },
];

const monthlyBars = [
  8, 62, 40, 35, 92, 30, 20, 55, 60, 45,
  50, 65, 70, 58, 40, 68, 72, 55, 48, 30,
  38, 62, 58, 42, 66, 5, 40, 55, 60, 35,
].map((v, i) => ({ day: i + 1, pct: v }));

const yearlySummary = [
  { key: "total", label: "Total Days", value: "140", color: "#1A1A1A" },
  { key: "completed", label: "Days Completed", value: "98", color: FIN_GREEN },
  { key: "missed", label: "Days Missed", value: "42", color: FIN_RED },
  { key: "accuracy", label: "Yearly Accuracy", value: "70%", color: FIN_GREEN },
];

const prayerTabs = [
  { key: "today", name: "Today", icon: Calendar },
  { key: "history", name: "History", icon: Clock },
  { key: "stats", name: "Stats", icon: BarChart3 },
  { key: "goals", name: "Goals", icon: Trophy },
  { key: "calendar", name: "Calendar", icon: Calendar },
];

const prayerBottomTabs = [
  { key: "home", name: "Home", icon: HomeIcon },
  { key: "daily-task", name: "Daily Task", icon: CheckSquare },
  { key: "prayer", name: "Prayer", icon: Landmark },
  { key: "profile", name: "Profile", icon: User },
];

function ServiceCard({ s, onOpen }) {
  const Icon = s.icon;
  return (
    <button
      onClick={() => onOpen(s)}
      style={{
        textAlign: "left",
        background: s.bg,
        border: "none",
        borderRadius: 16,
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={22} color={s.fg} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>{s.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#6b6d66" }}>
          {s.sub} <ChevronRight size={13} />
        </div>
      </div>
    </button>
  );
}

function QuickAction({ q }) {
  const Icon = q.icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "#fff", border: "1px solid #ECEDE8", borderRadius: 999,
      padding: "8px 14px", whiteSpace: "nowrap", flexShrink: 0
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: q.bg,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={13} color={q.fg} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: "#2B2B2B" }}>{q.name}</span>
    </div>
  );
}

function ProgressCard({ icon: Icon, iconBg, iconFg, cardBg, title, value, unit, goal, pct, barColor }) {
  return (
    <div style={{ background: cardBg, borderRadius: 14, padding: 14, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Icon size={14} color={iconFg} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{title}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>
        {value} <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6d66" }}>{unit}</span>
      </div>
      <div style={{ background: "#ffffffaa", borderRadius: 999, height: 5, margin: "8px 0 6px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 10.5, color: "#6b6d66" }}>{goal}</div>
    </div>
  );
}

function HealthScreen({ onBack }) {
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminder = (key) => {
    setReminders(rs => rs.map(r => r.key === key ? { ...r, on: !r.on } : r));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Health</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Track your health, live better</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={17} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -5, right: -5, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MoreHorizontal size={18} color="#1A1A1A" />
          </div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Greeting banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "20px 20px",
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6, maxWidth: 220 }}>
            Good Morning, Rakib! ☀️
          </div>
          <div style={{ fontSize: 12.5, color: "#5b5d56", marginTop: 6, maxWidth: 220, lineHeight: 1.5 }}>
            Take care of your body. It's the only place you have to live.
          </div>
          <button style={{
            marginTop: 12, background: "#fff", border: "1px solid #d6e9dc", color: GREEN,
            borderRadius: 999, padding: "7px 14px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            Health Tips <Lightbulb size={13} />
          </button>
          <HeartPulse size={70} color="#E0435A" style={{ position: "absolute", right: 14, top: 22, opacity: 0.9 }} />
        </div>

        {/* Vitals grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {vitals.map(v => {
            const Icon = v.icon;
            return (
              <div key={v.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: v.bg,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={15} color={v.fg} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{v.name}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>
                  {v.value} <span style={{ fontSize: 12, fontWeight: 500, color: v.fg }}>{v.unit}</span>
                </div>
                <span style={{
                  display: "inline-block", marginTop: 8, background: v.bg, color: v.fg,
                  fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 10px"
                }}>{v.status}</span>
              </div>
            );
          })}
        </div>

        {/* Add New Reading */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Add New Reading</span>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={14} color={GREEN} />
            </div>
          </div>
          {addReadings.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={17} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.sub}</div>
                </div>
                <ChevronRight size={16} color="#c7c8c2" />
              </div>
            );
          })}
        </div>

        {/* Health Overview */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Health Overview</span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
              borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
            }}>7 Days <ChevronDown size={12} /></span>
          </div>
          <div style={{ display: "flex", gap: 18, borderBottom: "2px solid #F0F1EC", marginBottom: 14 }}>
            {[HeartPulse, Droplet, Stethoscope, Scale].map((Icon, i) => (
              <div key={i} style={{
                paddingBottom: 8, borderBottom: i === 0 ? "2px solid #E0435A" : "2px solid transparent", marginBottom: -2
              }}>
                <Icon size={17} color={i === 0 ? "#E0435A" : "#c7c8c2"} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Heart Rate (bpm)</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#E0435A" }}>72 bpm</span>
          </div>
          <div style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} bpm`, "Heart rate"]} />
                <Line type="monotone" dataKey="bpm" stroke="#E0435A" strokeWidth={2.5} dot={{ r: 4, fill: "#E0435A" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            background: "#FCE9EB", borderRadius: 12, padding: 12, marginTop: 8,
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartPulse size={15} color="#E0435A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Your average heart rate</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>72 bpm</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Normal range</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>60 - 100 bpm</div>
            </div>
          </div>
        </div>

        {/* Steps / Water / Sleep */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <ProgressCard icon={Footprints} iconBg="#fff" iconFg="#1F8A5A" cardBg="#EAF6EF"
            title="Steps" value="6,245" unit="steps" goal="Goal: 10,000 steps" pct={62} barColor="#1F8A5A" />
          <ProgressCard icon={GlassWater} iconBg="#fff" iconFg="#2F6FE0" cardBg="#EAF1FC"
            title="Water Intake" value="6" unit="glasses" goal="Goal: 8 glasses" pct={75} barColor="#2F6FE0" />
          <ProgressCard icon={Moon} iconBg="#fff" iconFg="#6E4FD1" cardBg="#EFEAFB"
            title="Sleep" value="7h 30m" unit="" goal="Goal: 8 hours" pct={94} barColor="#6E4FD1" />
        </div>

        {/* Recent Readings */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Readings</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {recentReadings.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < recentReadings.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.meta}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{r.value}</div>
              </div>
            );
          })}
        </div>

        {/* Reminders */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Reminders</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {reminders.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < reminders.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={r.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{r.sub}</div>
                </div>
                <button
                  onClick={() => toggleReminder(r.key)}
                  style={{
                    width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer",
                    background: r.on ? GREEN : "#e2e3dd", position: "relative", flexShrink: 0
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: r.on ? 19 : 3, transition: "left 0.15s"
                  }} />
                </button>
              </div>
            );
          })}
          <button style={{
            width: "100%", background: "none", border: "none", color: GREEN, fontWeight: 600,
            fontSize: 13.5, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
          }}>
            <Plus size={15} /> Add New Reminder
          </button>
        </div>
      </div>
    </div>
  );
}

function FamilyMemberCard({ m }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: "16px 16px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: m.avatarBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 20, color: m.avatarFg, margin: "0 auto"
        }}>
          {m.initials}
        </div>
        {m.badge && (
          <span style={{
            position: "absolute", top: 10, right: 10, background: m.badgeColor, color: "#fff",
            fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 9px"
          }}>{m.badge}</span>
        )}
      </div>
      <div style={{ textAlign: "center", padding: "10px 10px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>{m.name}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: m.relColor, margin: "2px 0 4px" }}>{m.relation}</div>
        <div style={{ fontSize: 11, color: "#8B8D86", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Calendar size={11} /> {m.dob}
        </div>
      </div>
    </div>
  );
}

function FamilyScreen({ onBack }) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([
    { key: "fahim2", name: "Fahim Hasan", sub: "Wants to join your Family Tree", initials: "FH", bg: "#E5EFFC", fg: "#2F6FE0" },
  ]);
  const [connectedNote, setConnectedNote] = useState("");

  const handleAccept = (key) => {
    const req = incomingRequests.find(r => r.key === key);
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
    if (req) setConnectedNote(`You're now connected with ${req.name} in your Family Tree.`);
  };
  const handleDecline = (key) => {
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Family Tree</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Stay connected. Always.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Greeting banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "20px 20px",
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", maxWidth: 200 }}>
            Good Morning, Rakib! 👋
          </div>
          <div style={{ fontSize: 12.5, color: "#5b5d56", marginTop: 6, maxWidth: 190, lineHeight: 1.5 }}>
            Family is where life begins and love never ends.
          </div>
          <button onClick={() => setShowAddPanel(o => !o)} style={{
            marginTop: 12, background: "#fff", border: "1px solid #d6e9dc", color: GREEN,
            borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            <UserPlus size={14} /> Add Family Member
          </button>
          <TreePine size={78} color="#1F8A5A" style={{ position: "absolute", right: 8, top: 14, opacity: 0.9 }} />
        </div>

        {showAddPanel && (
          <div style={{ marginBottom: 14 }}>
            <ConnectByCareId
              label="Add a family member by their CARE ID"
            />
          </div>
        )}

        {incomingRequests.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SchSectionTitle>Connection Requests</SchSectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {incomingRequests.map(r => (
                <PendingRequestCard
                  key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                  onAccept={() => handleAccept(r.key)} onDecline={() => handleDecline(r.key)}
                />
              ))}
            </div>
          </div>
        )}

        {connectedNote && (
          <div style={{
            background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
          }}>
            <CheckCircle2 size={16} color={GREEN} /> {connectedNote}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Icon size={16} color={s.fg} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 10px" }}>
          <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Quick Actions</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyQuickActions.map(q => {
            const Icon = q.icon;
            return (
              <button key={q.key} style={{
                textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: q.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={16} color={q.fg} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{q.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* My Family */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>My Family</span>
          </div>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
            View All <ChevronRight size={14} />
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {familyMembers.map(m => <FamilyMemberCard key={m.key} m={m} />)}
        </div>

        <button style={{
          width: "100%", marginTop: 14, background: "#E4F3EA", border: "none", borderRadius: 14,
          padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, color: GREEN, fontWeight: 700, fontSize: 14.5, cursor: "pointer"
        }}>
          <Share2 size={16} /> View Full Family Tree <ArrowRight size={15} />
        </button>

        {/* Upcoming birthdays */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Upcoming Birthdays</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {upcomingBirthdays.map((b, i) => (
            <div key={b.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < upcomingBirthdays.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: b.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontWeight: 700, fontSize: 12, color: b.fg
              }}>{b.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{b.meta}</div>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Gift size={15} color={GREEN} />
              </div>
            </div>
          ))}
        </div>

        {/* Family Summary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Family Summary</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "4px 16px" }}>
          {[
            { icon: Users, fg: "#2F6FE0", label: "Generations", value: "3" },
            { icon: Heart, fg: "#E0435A", label: "Family Motto", value: '"Together We Grow"' },
            { icon: Calendar, fg: "#6E4FD1", label: "Family Created On", value: "01 Jan 2020" },
            { icon: ShieldCheck, fg: "#1F8A5A", label: "Privacy", value: "Only family members", arrow: true },
          ].map((row, i, arr) => {
            const Icon = row.icon;
            return (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "13px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #F0F1EC" : "none"
              }}>
                <Icon size={16} color={row.fg} />
                <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{row.value}</span>
                {row.arrow && <ChevronRight size={15} color="#c7c8c2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TravelScreen({ onBack }) {
  const [activeTripTab, setActiveTripTab] = useState("itinerary");
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [incomingTripRequests, setIncomingTripRequests] = useState([
    { key: "rafi2", name: "Rafi", sub: "Wants to join Cox's Bazar Trip", initials: "Rf", bg: "#E5EFFC", fg: "#2F6FE0" },
  ]);
  const [tripConnectedNote, setTripConnectedNote] = useState("");

  const handleTripAccept = (key) => {
    const req = incomingTripRequests.find(r => r.key === key);
    setIncomingTripRequests(rs => rs.filter(r => r.key !== key));
    if (req) setTripConnectedNote(`${req.name} has joined the trip.`);
  };
  const handleTripDecline = (key) => {
    setIncomingTripRequests(rs => rs.filter(r => r.key !== key));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Travel</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Plan together. Travel better.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Trip hero card */}
        <div style={{
          borderRadius: 18, overflow: "hidden", position: "relative", margin: "10px 0",
          background: "linear-gradient(160deg,#BFE3F0 0%,#DCEAC9 55%,#E8D9A6 100%)",
          padding: "18px 18px 70px"
        }}>
          <Sun size={38} color="#F2A93B" style={{ position: "absolute", top: 14, right: 18, opacity: 0.9 }} />
          <Waves size={160} color="#ffffff" style={{ position: "absolute", bottom: -10, right: -20, opacity: 0.35 }} />
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", position: "relative" }}>
            Cox's Bazar Trip 🌴
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Calendar size={14} /> 18 Dec (Wed) – 21 Dec (Sat) 2025
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Users size={14} /> 10 Travelers
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#2b2c28" }}>
              <Wallet size={14} /> Budget: ৳ 20,000
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, position: "relative" }}>
            <button style={{
              background: GREEN, color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
            }}>
              <Radio size={14} /> Live Trip
            </button>
            <button style={{
              background: "#fff", color: "#1A1A1A", border: "1px solid #e2e3dd", borderRadius: 10, padding: "9px 14px",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
            }}>
              <Pencil size={13} /> Edit Trip
            </button>
          </div>
        </div>

        {/* Stats scroll row */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginTop: -50, position: "relative" }}>
          {tripStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{
                background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 12,
                minWidth: 128, flexShrink: 0
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8
                }}>
                  <Icon size={14} color={s.fg} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", whiteSpace: "nowrap" }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{s.sub}</div>
                {s.progress && (
                  <div style={{ background: "#F0F1EC", borderRadius: 999, height: 4, marginTop: 6 }}>
                    <div style={{ width: `${s.progress}%`, height: "100%", background: "#2F6FE0", borderRadius: 999 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 18, overflowX: "auto", borderBottom: "1px solid #ECEDE8", margin: "16px 0 0", paddingBottom: 2 }}>
          {tripTabs.map(t => {
            const Icon = t.icon;
            const active = activeTripTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTripTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 5, paddingBottom: 8,
                borderBottom: active ? "2px solid #6E4FD1" : "2px solid transparent",
                color: active ? "#6E4FD1" : "#8B8D86", fontWeight: 600, fontSize: 12.5
              }}>
                <Icon size={14} /> {t.name}
              </button>
            );
          })}
        </div>

        {/* Live Expense Summary */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Live Expense Summary</span>
            <span style={{
              display: "flex", alignItems: "center", gap: 4, background: "#EFEAFB", color: "#6E4FD1",
              fontSize: 12, fontWeight: 600, borderRadius: 999, padding: "5px 10px"
            }}>
              <Plus size={12} /> Add Expense
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>Total Spent</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#E0435A" }}>৳ 4,350</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>Remaining Budget</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1F8A5A" }}>৳ 15,650</div>
            </div>
          </div>
          <div style={{ background: "#F0F1EC", borderRadius: 999, height: 6, marginTop: 10 }}>
            <div style={{ width: "22%", height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, color: "#8B8D86", marginTop: 6 }}>21.75% of ৳ 20,000</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 8px" }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>Recent Expenses</span>
            <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>View All</span>
          </div>
          {recentExpenses.map((e, i) => {
            const Icon = e.icon;
            return (
              <div key={e.key} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: e.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={14} color={e.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "#8B8D86" }}>{e.meta}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{e.amount}</div>
                  <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{e.paidBy}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Balance */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Member Balance</span>
          <button onClick={() => setShowAddTraveler(o => !o)} style={{
            background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 13,
            display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
          }}>
            <UserPlus size={14} /> Add Traveler
          </button>
        </div>

        {showAddTraveler && (
          <div style={{ marginBottom: 14 }}>
            <ConnectByCareId label="Invite a traveler by their CARE ID" />
          </div>
        )}

        {incomingTripRequests.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SchSectionTitle>Connection Requests</SchSectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {incomingTripRequests.map(r => (
                <PendingRequestCard
                  key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                  onAccept={() => handleTripAccept(r.key)} onDecline={() => handleTripDecline(r.key)}
                />
              ))}
            </div>
          </div>
        )}

        {tripConnectedNote && (
          <div style={{
            background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
          }}>
            <CheckCircle2 size={16} color={GREEN} /> {tripConnectedNote}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {memberBalances.map(m => (
            <div key={m.key} style={{
              background: "#fff", border: m.highlight ? `2px solid ${GREEN}` : "1px solid #ECEDE8",
              borderRadius: 14, padding: "14px 12px", minWidth: 92, flexShrink: 0, textAlign: "center"
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: "#E4F3EA", margin: "0 auto 8px",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: GREEN
              }}>{m.initials}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{m.name}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: m.positive ? "#1F8A5A" : "#E0435A", marginTop: 4 }}>{m.amount}</div>
              <div style={{ fontSize: 10, color: m.positive ? "#1F8A5A" : "#E0435A" }}>{m.status}</div>
            </div>
          ))}
        </div>

        {/* Today's Itinerary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Today's Itinerary</span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#6E4FD1", background: "#EFEAFB",
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
          }}>Day 1 <ChevronDown size={12} /></span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: "14px 16px" }}>
          {todayItinerary.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={it.key} style={{ display: "flex", gap: 12, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 60, flexShrink: 0 }}>
                  <div style={{ fontSize: 10.5, color: "#8B8D86", marginBottom: 6, whiteSpace: "nowrap" }}>{it.time}</div>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `2px solid ${it.fg}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon size={13} color={it.fg} />
                  </div>
                  {i < todayItinerary.length - 1 && <div style={{ width: 2, flex: 1, background: "#ECEDE8", marginTop: 2 }} />}
                </div>
                <div style={{ paddingBottom: 18, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{it.title}</div>
                    <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{it.sub}</div>
                  </div>
                  {it.done && <CheckCircle2 size={17} color="#1F8A5A" />}
                </div>
              </div>
            );
          })}
          <button style={{
            width: "100%", background: "#6E4FD1", border: "none", borderRadius: 12, color: "#fff",
            padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 4
          }}>
            <Calendar size={15} /> View Full Itinerary
          </button>
        </div>

        {/* Trip Checklist */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Trip Checklist</span>
        </div>
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16,
          display: "flex", alignItems: "center", gap: 14
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1F8A5A" }}>12 / 18</div>
            <div style={{ fontSize: 12, color: "#8B8D86", marginBottom: 8 }}>Items Packed</div>
            <div style={{ background: "#F0F1EC", borderRadius: 999, height: 5 }}>
              <div style={{ width: "66%", height: "100%", background: "#1F8A5A", borderRadius: 999 }} />
            </div>
            <button style={{
              marginTop: 10, background: "#E4F3EA", border: "none", borderRadius: 999, color: GREEN,
              fontWeight: 600, fontSize: 12.5, padding: "7px 14px", cursor: "pointer"
            }}>Open Checklist</button>
          </div>
          <Backpack size={54} color="#1F8A5A" strokeWidth={1.4} />
        </div>

        {/* Places to Visit */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Places to Visit</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>See All</span>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {placesToVisit.map(p => (
            <div key={p.key} style={{ flexShrink: 0, width: 96 }}>
              <div style={{ width: 96, height: 72, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={20} color="#fff" />
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", marginTop: 6 }}>{p.name}</div>
            </div>
          ))}
        </div>

        {/* Trip Chat */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Trip Chat</span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>See All</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {tripChat.map((c, i) => (
            <div key={c.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
              borderBottom: i < tripChat.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#E5EFFC",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#2F6FE0", flexShrink: 0
              }}>{c.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#6b6d66" }}>{c.msg}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{c.time}</div>
                {c.badge && (
                  <span style={{
                    display: "inline-block", marginTop: 4, background: "#1F8A5A", color: "#fff",
                    fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, lineHeight: "16px"
                  }}>{c.badge}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareIdBadge({ compact }) {
  const currentUser = useCurrentUser();
  const careId = currentUser?.careId || CARE_ID;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(careId);
    } catch (err) {
      // clipboard API unavailable — fail silently, badge still shows the ID to copy manually
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: compact ? 6 : 8, background: "#EFEAFB",
      color: "#6E4FD1", fontWeight: 600, fontSize: compact ? 11 : 12.5,
      borderRadius: 999, padding: compact ? "4px 6px 4px 10px" : "6px 8px 6px 12px"
    }}>
      <CreditCard size={compact ? 12 : 14} /> {careId}
      <button
        onClick={handleCopy}
        title="Copy CARE ID"
        style={{
          background: copied ? GREEN : "rgba(255,255,255,0.7)", border: "none",
          borderRadius: "50%", width: compact ? 20 : 24, height: compact ? 20 : 24,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          color: copied ? "#fff" : "#6E4FD1", flexShrink: 0
        }}
      >
        {copied ? <CheckCircle2 size={compact ? 11 : 13} /> : <Copy size={compact ? 11 : 13} />}
      </button>
    </div>
  );
}

// Shared "connect by CARE ID" flow used everywhere someone joins another person
// by ID: find → preview their profile → send request → they must accept.
function ConnectByCareId({ label, placeholder, onSent, onFind }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | notfound | found | sent | error
  const [profile, setProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFind = async () => {
    const id = input.trim().toUpperCase();
    if (!id) return;
    setErrorMsg("");
    if (onFind) {
      setStatus("loading");
      try {
        const match = await onFind(id);
        if (match) { setProfile(match); setStatus("found"); }
        else { setProfile(null); setStatus("notfound"); }
      } catch (err) {
        setProfile(null);
        setErrorMsg(err.message || "Something went wrong looking that up.");
        setStatus("error");
      }
    } else {
      const match = CARE_DIRECTORY[id];
      if (match) { setProfile(match); setStatus("found"); }
      else { setProfile(null); setStatus("notfound"); }
    }
  };

  const handleSend = async () => {
    if (onSent) {
      try {
        await onSent(profile);
      } catch (err) {
        setErrorMsg(err.message || "Couldn't send the request. Try again.");
        setStatus("error");
        return;
      }
    }
    setStatus("sent");
  };

  const reset = () => { setInput(""); setStatus("idle"); setProfile(null); setErrorMsg(""); };

  return (
    <div style={{ background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>
        {label || "Add by CARE ID"}
      </div>

      {status !== "sent" && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholder || "e.g. CARE-58213-AH"}
            style={{
              flex: 1, borderRadius: 8, border: "1px solid #ECEDE8", padding: "9px 10px",
              fontSize: 12.5, background: "#fff", color: "#1A1A1A"
            }}
          />
          <button onClick={handleFind} disabled={status === "loading"} style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px",
            fontWeight: 600, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap",
            opacity: status === "loading" ? 0.7 : 1
          }}>{status === "loading" ? "Finding..." : "Find"}</button>
        </div>
      )}

      {status === "notfound" && (
        <div style={{ fontSize: 11.5, color: "#E0435A", marginTop: 8 }}>
          No user found with that CARE ID. Double-check and try again.
        </div>
      )}

      {status === "error" && (
        <div style={{ fontSize: 11.5, color: "#E0435A", marginTop: 8 }}>
          {errorMsg}
        </div>
      )}

      {status === "found" && profile && (
        <div style={{
          marginTop: 10, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12,
          padding: 12, display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", background: profile.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: profile.fg, flexShrink: 0
          }}>{profile.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{profile.name}</div>
            <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{profile.phone}</div>
          </div>
          <button onClick={handleSend} style={{
            background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px",
            fontWeight: 600, fontSize: 12, cursor: "pointer"
          }}>Add</button>
        </div>
      )}

      {status === "sent" && profile && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={17} color={GREEN} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#1A1A1A", flex: 1, lineHeight: 1.5 }}>
            Request sent to <b>{profile.name}</b>. They'll get an Accept/Decline prompt — you'll be
            connected once they accept.
          </div>
          <button onClick={reset} style={{
            background: "none", border: "none", color: GREEN, fontSize: 11.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
          }}>Add another</button>
        </div>
      )}
    </div>
  );
}

function getInitialsFrom(name) {
  if (!name) return "NA";
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// Shows an incoming request from someone else trying to connect with this user,
// with Accept / Decline actions — the receiving side of ConnectByCareId.
function PendingRequestCard({ name, sub, initials, bg, fg, onAccept, onDecline }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, background: "#fff",
      border: "1px solid #ECEDE8", borderRadius: 12, padding: 12
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 13, color: fg, flexShrink: 0
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#8B8D86" }}>{sub}</div>
      </div>
      <button onClick={onDecline} style={{
        background: "#fff", border: "1px solid #ECEDE8", borderRadius: 8, padding: "6px 10px",
        fontSize: 11.5, fontWeight: 600, color: "#6b6d66", cursor: "pointer"
      }}>Decline</button>
      <button onClick={onAccept} style={{
        background: GREEN, border: "none", borderRadius: 8, padding: "6px 12px",
        fontSize: 11.5, fontWeight: 600, color: "#fff", cursor: "pointer"
      }}>Accept</button>
    </div>
  );
}


function RolePicker({ onChoose }) {
  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "#E4F3EA", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <BedDouble size={28} color={GREEN} />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 19, color: "#1A1A1A" }}>Hostel</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6b6d66" }}>How do you want to use this section?</p>
      </div>

      <button onClick={() => onChoose("manager")} style={{
        width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
        padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 12
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: "#E4F3EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <UserCog size={22} color={GREEN} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>I'm a Manager</div>
          <div style={{ fontSize: 12, color: "#8B8D86" }}>Run meals, rooms, rent and students</div>
        </div>
        <ChevronRight size={18} color="#c7c8c2" />
      </button>

      <button onClick={() => onChoose("student")} style={{
        width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
        padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer"
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: "#E5EFFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <GraduationCap size={22} color="#2F6FE0" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>I'm a Student</div>
          <div style={{ fontSize: 12, color: "#8B8D86" }}>See your room, meals and rent</div>
        </div>
        <ChevronRight size={18} color="#c7c8c2" />
      </button>

      <div style={{ marginTop: 20, background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12, fontSize: 11.5, color: "#6b6d66", lineHeight: 1.5 }}>
        Every My Care user has a unique CARE ID. Managers add students to their hostel using this ID — the same ID connects you across Family, Travel, Health and every other section.
      </div>
    </div>
  );
}

function ManagerDashboard({ currentUser, hostelId, hostelInfo }) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);

  useEffect(() => {
    if (!hostelId) return;
    const unsub = onSnapshot(collection(db, "hostels", hostelId, "students"), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [hostelId]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "connectionRequests"),
      where("fromUid", "==", currentUser.uid),
      where("type", "==", "hostel_student"),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSentInvites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const handleFindStudent = async (careId) => {
    const q = query(collection(db, "users"), where("careId", "==", careId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    if (docSnap.id === currentUser.uid) throw new Error("That's your own CARE ID.");
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      name: data.name,
      phone: "Not shared yet",
      initials: getInitialsFrom(data.name),
      bg: "#E5EFFC", fg: "#2F6FE0",
    };
  };

  const handleSendInvite = async (profile) => {
    await addDoc(collection(db, "connectionRequests"), {
      type: "hostel_student",
      fromUid: currentUser.uid,
      fromName: currentUser.name,
      toUid: profile.uid,
      hostelId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div>
      {/* Quick entry banner */}
      <div style={{ background: GREEN_DARK, borderRadius: 16, padding: 16, color: "#fff", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{hostelInfo?.name || "Your Hostel"}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>Managed by {currentUser?.name}</div>
          </div>
          <button onClick={() => setQuickEntryOpen(o => !o)} style={{
            background: "#fff", color: GREEN_DARK, border: "none", borderRadius: 999, padding: "8px 14px",
            fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            <Plus size={14} /> Quick Entry
          </button>
        </div>

        {quickEntryOpen && (
          <div style={{ marginTop: 14, background: "#fff", borderRadius: 12, padding: 4 }}>
            <ConnectByCareId
              label="Add a student by their CARE ID"
              onFind={handleFindStudent}
              onSent={handleSendInvite}
            />
          </div>
        )}
      </div>

      {sentInvites.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SchSectionTitle>Pending Invitations</SchSectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sentInvites.map(r => (
              <div key={r.id} style={{
                background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12,
                display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#6b6d66"
              }}>
                <Clock size={15} color="#E08A20" style={{ flexShrink: 0 }} />
                Waiting for a student to accept your invite.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Students (real) */}
      <SchSectionTitle>My Students ({students.length})</SchSectionTitle>
      {students.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          marginBottom: 16, fontSize: 12.5, color: "#6b6d66"
        }}>
          No students yet — use Quick Entry above to add one by their CARE ID.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {students.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < students.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: GREEN, fontSize: 12.5, flexShrink: 0
              }}>{getInitialsFrom(s.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.careId}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats grid — illustrative demo numbers except Students, which is real */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {managerStats.map(s => {
          const Icon = s.icon;
          const value = s.key === "students" ? students.length : s.value;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
              }}>
                <Icon size={16} color={s.fg} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#8B8D86" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Meals Summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Utensils size={16} /> Today's Meals Summary
        </span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>View all</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {mealsSummary.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: "12px 6px", textAlign: "center" }}>
              <Icon size={16} color={m.fg} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{m.value}</div>
              <div style={{ fontSize: 10, color: "#8B8D86" }}>{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Input Menu For Today */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
            <SquarePen size={15} /> Input Menu For Today
          </span>
          <ChevronRight size={16} color="#c7c8c2" />
        </div>
        {menuToday.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={m.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
              borderTop: "1px solid #F0F1EC", marginTop: 10
            }}>
              <Icon size={16} color={m.fg} />
              <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{m.name}</span>
              <span style={{ fontSize: 12.5, color: "#8B8D86" }}>{m.items} items</span>
              <ChevronRight size={15} color="#c7c8c2" />
            </div>
          );
        })}
        <button style={{
          width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
          padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 14
        }}>
          <CheckCircle2 size={15} /> Submit Today's Menu
        </button>
      </div>

      {/* Recent Activities */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Activities</span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View all</span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {recentActivities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < recentActivities.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: a.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon size={15} color={a.fg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{a.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentDashboard({ currentUser, hostelId, hostelInfo, onAccepted }) {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "connectionRequests"),
      where("toUid", "==", currentUser.uid),
      where("type", "==", "hostel_student"),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPendingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const handleAccept = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "accepted" });
    await setDoc(doc(db, "hostels", req.hostelId, "students", currentUser.uid), {
      uid: currentUser.uid, name: currentUser.name, careId: currentUser.careId,
      joinedAt: serverTimestamp(),
    });
    await setDoc(doc(db, "users", currentUser.uid), {
      hostel: { role: "student", hostelId: req.hostelId },
    }, { merge: true });
    onAccepted(req.hostelId);
  };

  const handleDecline = async (req) => {
    await updateDoc(doc(db, "connectionRequests", req.id), { status: "declined" });
  };

  return (
    <div>
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SchSectionTitle>Connection Requests</SchSectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingRequests.map(r => (
              <PendingRequestCard
                key={r.id} name={r.fromName} sub="Wants to add you as a student"
                initials={getInitialsFrom(r.fromName)} bg="#E4F3EA" fg={GREEN}
                onAccept={() => handleAccept(r)} onDecline={() => handleDecline(r)}
              />
            ))}
          </div>
        </div>
      )}

      {hostelId && hostelInfo && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} style={{ flexShrink: 0 }} />
          You're a student at <b>&nbsp;{hostelInfo.name}</b>
        </div>
      )}

      {!hostelId && pendingRequests.length === 0 && (
        <div style={{
          background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 16,
          marginBottom: 16, fontSize: 12.5, color: "#6b6d66", lineHeight: 1.6
        }}>
          You're not part of a hostel yet. Share your CARE ID with your hostel manager so they can add you.
        </div>
      )}

      {/* Top stats — illustrative demo content until room/rent/meal tracking is built */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {studentTopStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: "10px 8px" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6
              }}>
                <Icon size={12} color={s.fg} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#8B8D86" }}>{s.label}</div>
              <div style={{ fontSize: 8.5, color: "#8B8D86" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Meals */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Utensils size={16} /> Today's Meals
        </span>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
          borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
        }}>Tue, 17 Jun <ChevronDown size={12} /></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {studentMeals.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>
                  <Icon size={15} color={m.fg} /> {m.name}
                </span>
                <span style={{ background: m.statusBg, color: m.statusColor, fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 10px" }}>{m.status}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "#8B8D86", margin: "6px 0 4px" }}>{m.time}</div>
              <div style={{ fontSize: 12.5, color: "#1A1A1A" }}>{m.items}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: "#E4F3EA", borderRadius: 12, padding: 12, marginTop: 12,
        display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#1A1A1A"
      }}>
        <Info size={15} color={GREEN} /> Please be on time for your meals. Thank you!
      </div>

      {/* Today's Menu */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
            <SquarePen size={15} /> Today's Menu
          </span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>View full menu</span>
        </div>
        {studentMenu.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderTop: "1px solid #F0F1EC", marginTop: 8
            }}>
              <Icon size={16} color={m.fg} />
              <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{m.name}</span>
              <span style={{ fontSize: 12.5, color: "#8B8D86" }}>{m.items} items</span>
              <ChevronRight size={15} color="#c7c8c2" />
            </div>
          );
        })}
      </div>

      {/* My Rent / My Guests */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <div style={{ flex: 1, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Banknote size={14} /> My Rent
            </span>
            <span style={{ background: "#E4F3EA", color: GREEN, fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>Paid</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>৳ 4,000</div>
          <div style={{ fontSize: 11, color: "#8B8D86" }}>Due: 5 Jul 2025</div>
        </div>
        <div style={{ flex: 1, background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={14} /> My Guests
            </span>
            <span style={{ background: "#E5EFFC", color: "#2F6FE0", fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 8px" }}>This month</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>1 / 2</div>
          <div style={{ fontSize: 11, color: "#8B8D86" }}>Used / Allowed</div>
        </div>
      </div>

      {/* Notices */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
          <Bell size={15} /> Notices
        </span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View all</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {studentNotices.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.key} style={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Icon size={15} color={n.fg} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{n.title}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>{n.meta}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HostelScreen({ onBack }) {
  const currentUser = useCurrentUser();
  const [loadingRole, setLoadingRole] = useState(true);
  const [role, setRole] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [activeHostelTab, setActiveHostelTab] = useState("dashboard");
  const tabs = role === "manager" ? managerTabs : studentTabs;

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};
        if (data.hostel) {
          setRole(data.hostel.role);
          setHostelId(data.hostel.hostelId || null);
        }
      } catch (err) {
        console.error("Failed to load hostel role:", err);
      }
      setLoadingRole(false);
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!hostelId) { setHostelInfo(null); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "hostels", hostelId));
        if (snap.exists()) setHostelInfo(snap.data());
      } catch (err) {
        console.error("Failed to load hostel info:", err);
      }
    })();
  }, [hostelId]);

  const handleChooseRole = async (r) => {
    if (!currentUser) return;
    if (r === "manager") {
      const newHostelRef = await addDoc(collection(db, "hostels"), {
        name: `${currentUser.name}'s Hostel`,
        managerUid: currentUser.uid,
        managerName: currentUser.name,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", currentUser.uid), {
        hostel: { role: "manager", hostelId: newHostelRef.id },
      }, { merge: true });
      setHostelId(newHostelRef.id);
    } else {
      await setDoc(doc(db, "users", currentUser.uid), {
        hostel: { role: "student", hostelId: null },
      }, { merge: true });
      setHostelId(null);
    }
    setRole(r);
    setActiveHostelTab("dashboard");
  };

  const handleSwitchRole = async () => {
    setRole(null);
    setHostelId(null);
    setHostelInfo(null);
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { hostel: null }, { merge: true });
    }
  };

  const handleAccepted = (newHostelId) => {
    setHostelId(newHostelId);
  };

  if (loadingRole) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#8B8D86", fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (!role) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 0" }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <ArrowLeft size={18} color="#1A1A1A" />
          </button>
        </div>
        <RolePicker onChoose={handleChooseRole} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <BedDouble size={17} color={GREEN} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16.5, color: "#1A1A1A" }}>
              {role === "manager" ? "Hostel Manager" : `Good Morning, ${(currentUser?.name || "there").split(" ")[0]} 👋`}
            </div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>
              {role === "manager" ? "Manager Dashboard" : "Have a great day!"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        {/* CARE ID + role switch */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 14px" }}>
          <CareIdBadge compact />
          <button onClick={handleSwitchRole} style={{
            background: "none", border: "1px solid #ECEDE8", borderRadius: 999, padding: "5px 10px",
            fontSize: 11.5, fontWeight: 600, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5, cursor: "pointer"
          }}>
            <ArrowLeftRight size={12} /> Switch role
          </button>
        </div>

        {role === "manager" ? (
          <ManagerDashboard currentUser={currentUser} hostelId={hostelId} hostelInfo={hostelInfo} />
        ) : (
          <StudentDashboard currentUser={currentUser} hostelId={hostelId} hostelInfo={hostelInfo} onAccepted={handleAccepted} />
        )}

        {/* Section tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeHostelTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveHostelTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? GREEN : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? GREEN : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SchQuickAccess({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {items.map(q => {
        const Icon = q.icon;
        return (
          <div key={q.key} style={{ textAlign: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: q.bg, margin: "0 auto 6px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={19} color={q.fg} />
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
          </div>
        );
      })}
    </div>
  );
}

function SchUpdatesList({ items }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
      {items.map((u, i) => (
        <div key={u.key} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
          borderBottom: i < items.length - 1 ? "1px solid #F0F1EC" : "none"
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c7c8c2", flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 13, color: "#1A1A1A" }}>{u.text}</div>
          <div style={{ fontSize: 11, color: "#8B8D86", whiteSpace: "nowrap" }}>{u.meta}</div>
        </div>
      ))}
    </div>
  );
}

function SchSectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
      <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>{children}</span>
      {action && <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5 }}>{action}</span>}
    </div>
  );
}

function SchoolStudentDashboard() {
  const [incomingRequests, setIncomingRequests] = useState([
    { key: "parent1", name: "Hasan Al Mamun", sub: "Wants to link as your parent", initials: "HM", bg: "#E4F3EA", fg: "#1F8A5A" },
  ]);
  const [connectedNote, setConnectedNote] = useState("");

  const handleAccept = (key) => {
    const req = incomingRequests.find(r => r.key === key);
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
    if (req) setConnectedNote(`You're now linked with ${req.name}.`);
  };
  const handleDecline = (key) => {
    setIncomingRequests(rs => rs.filter(r => r.key !== key));
  };

  return (
    <div>
      {incomingRequests.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SchSectionTitle>Connection Requests</SchSectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {incomingRequests.map(r => (
              <PendingRequestCard
                key={r.key} name={r.name} sub={r.sub} initials={r.initials} bg={r.bg} fg={r.fg}
                onAccept={() => handleAccept(r.key)} onDecline={() => handleDecline(r.key)}
              />
            ))}
          </div>
        </div>
      )}
      {connectedNote && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} /> {connectedNote}
        </div>
      )}
      <div style={{
        background: "#F3F0FC", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#EFEAFB", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6E4FD1", fontSize: 16, flexShrink: 0
        }}>RH</div>
        <div>
          <div style={{ fontSize: 12, color: "#6E4FD1", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <GraduationCap size={14} /> Student Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Rakib Hasan 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Class 9 · Section A</div>
        </div>
      </div>

      <SchSectionTitle action="View all">Today's Classes</SchSectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schStudentClasses.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={c.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < schStudentClasses.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <Icon size={16} color={c.fg} />
              <div style={{ fontSize: 12, color: "#8B8D86", width: 62 }}>{c.time}</div>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{c.room}</div>
            </div>
          );
        })}
      </div>

      <SchSectionTitle action="This week">My Progress</SchSectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schStudentProgress.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={p.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
              borderBottom: i < schStudentProgress.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <Icon size={16} color={p.fg} />
              <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{p.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{p.value}</span>
            </div>
          );
        })}
      </div>

      <SchSectionTitle>Quick Access</SchSectionTitle>
      <SchQuickAccess items={schStudentQuickAccess} />

      <SchSectionTitle action="View all">Recent Updates</SchSectionTitle>
      <SchUpdatesList items={schStudentUpdates} />
    </div>
  );
}

function SchoolParentDashboard() {
  const [showLinkChild, setShowLinkChild] = useState(false);
  const [linkedNote, setLinkedNote] = useState("");

  return (
    <div>
      <div style={{
        background: "#EAF6EF", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#E4F3EA", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: GREEN, fontSize: 16, flexShrink: 0
        }}>HM</div>
        <div>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Users size={14} /> Parent Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Hasan Al Mamun 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Parent of Rakib Hasan</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Child Overview</span>
        <button onClick={() => setShowLinkChild(o => !o)} style={{
          background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 12.5,
          display: "flex", alignItems: "center", gap: 4, cursor: "pointer"
        }}>
          <UserPlus size={13} /> Link Child
        </button>
      </div>

      {showLinkChild && (
        <div style={{ marginBottom: 14 }}>
          <ConnectByCareId
            label="Link your child by their CARE ID"
            onSent={(profile) => setLinkedNote(`Request sent to ${profile.name}. They'll need to accept before you're linked.`)}
          />
        </div>
      )}
      {linkedNote && (
        <div style={{
          background: "#E4F3EA", borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1A1A1A"
        }}>
          <CheckCircle2 size={16} color={GREEN} /> {linkedNote}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schChildOverview.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: c.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={c.fg} />
              </div>
              {c.value && <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A" }}>{c.value}</div>}
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{c.label}</div>
              {c.sub && <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{c.sub}</div>}
            </div>
          );
        })}
      </div>

      <SchSectionTitle>Today at School</SchSectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "14px 16px" }}>
        {schTodayAtSchool.map((t, i) => (
          <div key={t.key} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, marginTop: 4 }} />
              {i < schTodayAtSchool.length - 1 && <div style={{ width: 2, flex: 1, background: "#ECEDE8", marginTop: 2 }} />}
            </div>
            <div style={{ paddingBottom: 16, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11.5, color: "#8B8D86" }}>{t.time}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{t.name}</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: t.color }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>

      <SchSectionTitle>Quick Access</SchSectionTitle>
      <SchQuickAccess items={schParentQuickAccess} />

      <SchSectionTitle action="View all">Recent Updates</SchSectionTitle>
      <SchUpdatesList items={schParentUpdates} />
    </div>
  );
}

function SchoolTeacherDashboard() {
  return (
    <div>
      <div style={{
        background: "#EAF1FC", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "#E5EFFC", display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2F6FE0", fontSize: 16, flexShrink: 0
        }}>AS</div>
        <div>
          <div style={{ fontSize: 12, color: "#2F6FE0", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <User size={14} /> Teacher Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Abdullah Sir 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Math Teacher</div>
        </div>
      </div>

      <SchSectionTitle action="View all">Today's Schedule</SchSectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {schTeacherSchedule.map((s, i) => (
          <div key={s.key} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < schTeacherSchedule.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <Users size={16} color="#2F6FE0" />
            <div style={{ fontSize: 12, color: "#8B8D86", width: 62 }}>{s.time}</div>
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.room}</div>
          </div>
        ))}
      </div>

      <SchSectionTitle>My Classes</SchSectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schTeacherStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: s.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={s.fg} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <SchSectionTitle>Quick Access</SchSectionTitle>
      <SchQuickAccess items={schTeacherQuickAccess} />

      <SchSectionTitle action="View all">Recent Activities</SchSectionTitle>
      <SchUpdatesList items={schTeacherActivities} />
    </div>
  );
}

function SchoolAdminDashboard() {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div>
      <div style={{
        background: "#FDF0DF", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 4
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, background: "#FDEFE4", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <School size={24} color="#E08A20" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#E08A20", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Building2 size={14} /> School Dashboard
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>Good Morning, Admin 👋</div>
          <div style={{ fontSize: 11.5, color: "#6b6d66" }}>Greenfield School</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <button onClick={() => setShowAddMember(o => !o)} style={{
          background: "#E08A20", border: "none", borderRadius: 999, padding: "8px 14px",
          fontSize: 12.5, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
        }}>
          <UserPlus size={13} /> Add Student / Teacher
        </button>
      </div>
      {showAddMember && (
        <div style={{ marginBottom: 14 }}>
          <ConnectByCareId label="Add a student or teacher by their CARE ID" />
        </div>
      )}

      <SchSectionTitle action="This month">School Overview</SchSectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {schOverviewStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: s.bg, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>
                <Icon size={15} color={s.fg} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <SchSectionTitle>Quick Access</SchSectionTitle>
      <SchQuickAccess items={schAdminQuickAccess} />

      <SchSectionTitle action="View all">Recent Updates</SchSectionTitle>
      <SchUpdatesList items={schAdminUpdates} />

      <SchSectionTitle>Today's Summary</SchSectionTitle>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 16px" }}>
        {schAdminSummary.map((s, i) => (
          <div key={s.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0",
            borderBottom: i < schAdminSummary.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <span style={{ fontSize: 13, color: "#1A1A1A" }}>{s.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const schoolRoles = [
  { key: "student", name: "I'm a Student", sub: "See classes, homework and progress", icon: GraduationCap, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "parent", name: "I'm a Parent", sub: "Track your child's school life", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "teacher", name: "I'm a Teacher", sub: "Manage classes, homework and results", icon: User, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "school", name: "I'm from School", sub: "Run school-wide operations", icon: School, bg: "#FDF0DF", fg: "#E08A20" },
];

function SchoolRolePicker({ onChoose }) {
  return (
    <div style={{ padding: "8px 20px 40px" }}>
      <div style={{ textAlign: "center", margin: "20px 0 24px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "#E5EFFC", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <GraduationCap size={28} color="#2F6FE0" />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#1A1A1A" }}>Choose your role</h2>
        <p style={{ margin: 0, fontSize: 12.5, color: "#6b6d66" }}>Select your role to get a personalised dashboard</p>
      </div>

      {schoolRoles.map(r => {
        const Icon = r.icon;
        return (
          <button key={r.key} onClick={() => onChoose(r.key)} style={{
            width: "100%", textAlign: "left", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16,
            padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 12
          }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color={r.fg} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#8B8D86" }}>{r.sub}</div>
            </div>
            <ChevronRight size={18} color="#c7c8c2" />
          </button>
        );
      })}

      <div style={{ marginTop: 8, background: "#F7F8F4", border: "1px solid #ECEDE8", borderRadius: 12, padding: 12, fontSize: 11.5, color: "#6b6d66", lineHeight: 1.5 }}>
        You can change your role anytime from School Settings. Your CARE ID connects you to your school just like it does in Hostel, Family and every other section.
      </div>
    </div>
  );
}

function SchoolScreen({ onBack }) {
  const [role, setRole] = useState(null);
  const [activeSchTab, setActiveSchTab] = useState("home");

  const roleMeta = {
    student: { title: "School", tabs: schStudentTabs, accent: "#6E4FD1", Dashboard: SchoolStudentDashboard },
    parent: { title: "School", tabs: schParentTabs, accent: GREEN, Dashboard: SchoolParentDashboard },
    teacher: { title: "School", tabs: schTeacherTabs, accent: "#2F6FE0", Dashboard: SchoolTeacherDashboard },
    school: { title: "School", tabs: schAdminTabs, accent: "#E08A20", Dashboard: SchoolAdminDashboard },
  };

  if (!role) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 0" }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <ArrowLeft size={18} color="#1A1A1A" />
          </button>
        </div>
        <SchoolRolePicker onChoose={(r) => { setRole(r); setActiveSchTab("home"); }} />
      </div>
    );
  }

  const meta = roleMeta[role];
  const Dashboard = meta.Dashboard;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>School</div>
        <div style={{ position: "relative" }}>
          <Bell size={19} color="#1A1A1A" />
          <span style={{
            position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
            fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>3</span>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 14px" }}>
          <CareIdBadge compact />
          <button onClick={() => setRole(null)} style={{
            background: "none", border: "1px solid #ECEDE8", borderRadius: 999, padding: "5px 10px",
            fontSize: 11.5, fontWeight: 600, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5, cursor: "pointer"
          }}>
            <ArrowLeftRight size={12} /> Switch role
          </button>
        </div>

        <Dashboard />

        {/* Section tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {meta.tabs.map(t => {
            const Icon = t.icon;
            const active = activeSchTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveSchTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? meta.accent : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? meta.accent : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinanceScreen({ onBack }) {
  const [activeFinTab, setActiveFinTab] = useState("finance");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Finance</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Manage your money, secure your future</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 4px" }}>
          <CareIdBadge compact />
        </div>
        {/* Greeting banner */}
        <div style={{
          margin: "10px 0", borderRadius: 18, padding: "20px 20px",
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", maxWidth: 220 }}>
            Good Morning, Rakib! 👋
          </div>
          <div style={{ fontSize: 12.5, color: "#5b5d56", marginTop: 6, maxWidth: 200, lineHeight: 1.5 }}>
            Take control of your finances and achieve your goals.
          </div>
          <button style={{
            marginTop: 12, background: "#fff", border: "1px solid #d6e9dc", color: GREEN,
            borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
          }}>
            <Lightbulb size={13} /> Finance Tips <ArrowRight size={13} />
          </button>
          <Wallet size={70} color={FIN_GREEN} style={{ position: "absolute", right: 14, top: 20, opacity: 0.9 }} />
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {financeStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Icon size={16} color={s.fg} />
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>{s.label}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", margin: "4px 0 8px" }}>{s.value}</div>
                <span style={{
                  display: "inline-block", background: s.changeBg, color: s.changeColor,
                  fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "3px 8px"
                }}>{s.change}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Quick Actions</span>
            <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5, display: "flex", alignItems: "center", gap: 2 }}>
              View All <ChevronRight size={13} />
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {financeQuickActions.map(q => {
              const Icon = q.icon;
              return (
                <div key={q.key} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: q.fg, margin: "0 auto 6px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={19} color="#fff" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1A1A1A" }}>{q.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income vs Expense */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Income vs Expense</span>
            <span style={{
              fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
              borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
            }}>This Month <ChevronDown size={12} /></span>
          </div>
          <div style={{ display: "flex", gap: 20, margin: "10px 0" }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: FIN_GREEN }}>৳ 38,750</div>
              <div style={{ fontSize: 11, color: "#8B8D86" }}>Income</div>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: FIN_RED }}>৳ 14,170</div>
              <div style={{ fontSize: 11, color: "#8B8D86" }}>Expense</div>
            </div>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#8B8D86" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#8B8D86" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v) => `৳ ${v.toLocaleString()}`} />
                <Bar dataKey="income" fill={FIN_GREEN} radius={[3, 3, 0, 0]} />
                <Bar dataKey="expense" fill={FIN_RED} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 6 }}>
            <span style={{ fontSize: 11.5, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_GREEN, display: "inline-block" }} /> Income
            </span>
            <span style={{ fontSize: 11.5, color: "#6b6d66", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_RED, display: "inline-block" }} /> Expense
            </span>
          </div>
        </div>

        {/* Expense by Category */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Expense by Category</span>
            <span style={{
              fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
              borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
            }}>This Month <ChevronDown size={12} /></span>
          </div>
          <div style={{ height: 160, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseCategories} dataKey="value" innerRadius={44} outerRadius={68} startAngle={90} endAngle={-270}>
                  {expenseCategories.map(c => <Cell key={c.key} fill={c.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              textAlign: "center", pointerEvents: "none"
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>৳ 14,170</div>
              <div style={{ fontSize: 10.5, color: "#8B8D86" }}>Total</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            {expenseCategories.map((c, i) => {
              const Icon = financeCategoryIcons[c.key];
              return (
                <div key={c.key} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                  borderTop: i > 0 ? "1px solid #F0F1EC" : "none"
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#1A1A1A", flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A1A" }}>৳ {c.value.toLocaleString()}</span>
                  <span style={{ fontSize: 11.5, color: "#8B8D86", width: 32, textAlign: "right" }}>{c.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Savings Goal */}
        <div style={{
          background: "#FDF6E9", border: "1px solid #F5E7C4", borderRadius: 16, padding: 16, marginTop: 16,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <Target size={30} color="#E08A20" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>Monthly Savings Goal</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "2px 0 6px" }}>
              ৳ 12,350 <span style={{ fontWeight: 500, color: "#8B8D86", fontSize: 12.5 }}>/ ৳ 20,000</span>
            </div>
            <div style={{ background: "#f0e6c8", borderRadius: 999, height: 6 }}>
              <div style={{ width: "62%", height: "100%", background: FIN_GREEN, borderRadius: 999 }} />
            </div>
            <div style={{ fontSize: 11.5, color: "#6b6d66", marginTop: 6 }}>You're doing great! Keep it up! 💪</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>62%</div>
            <button style={{
              background: "#E08A20", color: "#fff", border: "none", borderRadius: 999, padding: "6px 10px",
              fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
            }}>View Goals →</button>
          </div>
        </div>

        {/* Recent Transactions */}
        <SchSectionTitle action="View All">Recent Transactions</SchSectionTitle>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {recentTransactions.map((t, i) => (
            <div key={t.key} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < recentTransactions.length - 1 ? "1px solid #F0F1EC" : "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: t.positive ? "#E4F3EA" : "#FCE9EB",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {t.positive ? <ArrowDown size={15} color={FIN_GREEN} /> : <ArrowUp size={15} color={FIN_RED} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#8B8D86" }}>{t.meta}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.positive ? FIN_GREEN : FIN_RED }}>{t.amount}</div>
              <ChevronRight size={15} color="#c7c8c2" />
            </div>
          ))}
        </div>

        {/* Upcoming Bills */}
        <SchSectionTitle action="View All">Upcoming Bills</SchSectionTitle>
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
          {upcomingBills.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={b.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: "1px solid #F0F1EC"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: b.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={15} color={b.fg} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#8B8D86" }}>{b.meta}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{b.amount}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: b.statusColor, background: b.statusBg, borderRadius: 999, padding: "2px 8px", marginTop: 2, display: "inline-block" }}>{b.status}</div>
                </div>
              </div>
            );
          })}
          <button style={{
            width: "100%", background: "none", border: "none", color: GREEN, fontWeight: 600,
            fontSize: 13.5, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
          }}>
            Pay All Due Bills <ArrowRight size={14} />
          </button>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {financeTabs.map(t => {
            const Icon = t.icon;
            const active = activeFinTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveFinTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? GREEN : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? GREEN : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayRing({ d }) {
  const r = 24, c = 2 * Math.PI * r;
  const offset = c - (d.pct / 100) * c;
  return (
    <div style={{
      textAlign: "center", padding: "10px 4px", borderRadius: 12,
      background: d.active ? "#E4F3EA" : "transparent"
    }}>
      <div style={{ fontSize: 11, color: "#8B8D86", marginBottom: 2 }}>{d.day}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>{d.date}</div>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#F0F1EC" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none" stroke={d.color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
        <text x="28" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">{d.ratio}</text>
      </svg>
    </div>
  );
}

function PrayerHistoryTab() {
  return (
    <div>
      {/* Prayer Overview */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A", marginBottom: 12 }}>Prayer Overview</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {prayerOverview.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} style={{ background: s.bg, borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1A1A1A", marginBottom: 6 }}>
                  <Icon size={14} color={s.fg} /> {s.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: "#6b6d66" }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yesterday */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Yesterday (19 May 2025)</span>
        <span style={{ color: GREEN, fontWeight: 600, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}>
          Edit <Pencil size={12} />
        </span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
        {yesterdayPrayers.map((p, i) => (
          <div key={p.key} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < yesterdayPrayers.length - 1 ? "1px solid #F0F1EC" : "none"
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: p.bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <p.icon size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                {p.name} <span style={{ fontWeight: 400, color: "#6b6d66" }}>{p.arabic}</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#8B8D86", width: 70 }}>{p.time}</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600,
              color: p.status === "Prayed" ? FIN_GREEN : FIN_RED
            }}>
              {p.status === "Prayed" ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {p.status}
            </div>
          </div>
        ))}
        <button style={{
          width: "100%", background: GREEN_DARK, border: "none", borderRadius: 12, color: "#fff",
          padding: "12px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", margin: "12px 0 8px"
        }}>
          <Plus size={15} /> Add / Edit Day
        </button>
      </div>

      {/* Your Progress */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Your Progress</span>
          <span style={{
            fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
          }}>This Week <ChevronDown size={12} /></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {weeklyProgress.map(d => <DayRing key={d.key} d={d} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_GREEN, display: "inline-block" }} /> Prayed
            </span>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_ORANGE, display: "inline-block" }} /> Partial
            </span>
            <span style={{ fontSize: 11, color: "#6b6d66", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: FIN_RED, display: "inline-block" }} /> Missed
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#1A1A1A" }}>Weekly Accuracy: <b style={{ color: FIN_GREEN }}>71%</b></span>
        </div>
      </div>

      {/* Monthly Overview */}
      <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Monthly Overview</span>
          <span style={{
            fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
            borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
          }}>May 2025 <ChevronDown size={12} /></span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 108 }}>
            {[
              { label: "Total Days", value: "19", color: "#1A1A1A" },
              { label: "Days Completed", value: "13", color: FIN_GREEN },
              { label: "Days Missed", value: "6", color: FIN_RED },
              { label: "Monthly Accuracy", value: "68%", color: FIN_GREEN },
            ].map(r => (
              <div key={r.label}>
                <div style={{ fontSize: 10.5, color: "#8B8D86" }}>{r.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: r.color }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBars} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8B8D86" }} axisLine={false} tickLine={false}
                  ticks={[1, 5, 10, 15, 20, 25, 30]} />
                <YAxis tick={{ fontSize: 9, fill: "#8B8D86" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
                  {monthlyBars.map((b, i) => <Cell key={i} fill={FIN_GREEN} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontWeight: 700, fontSize: 15.5, color: "#1A1A1A" }}>Yearly Summary</span>
        <span style={{
          fontSize: 11.5, fontWeight: 600, color: "#1A1A1A", border: "1px solid #ECEDE8",
          borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4
        }}>Year 2025 <ChevronDown size={12} /></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {yearlySummary.map(y => (
          <div key={y.key} style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11.5, color: "#8B8D86", marginBottom: 4 }}>{y.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: y.color }}>{y.value}</div>
          </div>
        ))}
      </div>

      {/* Quote banner */}
      <div style={{
        background: "#EAF6EF", borderRadius: 14, padding: 14, marginTop: 16,
        display: "flex", alignItems: "flex-start", gap: 12
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Landmark size={17} color={GREEN} />
        </div>
        <div style={{ fontSize: 12.5, color: "#1A1A1A", lineHeight: 1.6 }}>
          <b>Stay consistent, for the sake of Allah.</b><br />
          <span style={{ color: "#6b6d66" }}>"Indeed, prayer prohibits immorality and wrongdoing." – Quran 29:45</span>
        </div>
      </div>
    </div>
  );
}

function PrayerComingSoon({ label }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 16, padding: 30, textAlign: "center", color: "#8B8D86" }}>
      <Landmark size={30} color="#c7c8c2" style={{ marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
      <div style={{ fontSize: 12.5, marginTop: 4 }}>This view is coming next — let me know if you'd like it built out.</div>
    </div>
  );
}

function PrayerScreen({ onBack }) {
  const [activePrayerTab, setActivePrayerTab] = useState("history");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Menu size={18} color="#1A1A1A" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, marginLeft: 10 }}>
          <CareLogo size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Prayer</div>
            <div style={{ fontSize: 11, color: "#8B8D86" }}>Track your prayers. Grow your faith.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Bell size={19} color="#1A1A1A" />
            <span style={{
              position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>3</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12.5, color: GREEN
          }}>RH</div>
        </div>
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <div style={{ margin: "8px 0 0" }}>
          <CareIdBadge compact />
        </div>
        {/* Prayer tabs */}
        <div style={{ display: "flex", gap: 18, overflowX: "auto", borderBottom: "1px solid #ECEDE8", margin: "6px 0 16px", paddingBottom: 2 }}>
          {prayerTabs.map(t => {
            const Icon = t.icon;
            const active = activePrayerTab === t.key;
            return (
              <button key={t.key} onClick={() => setActivePrayerTab(t.key)} style={{
                background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 5, paddingBottom: 8,
                borderBottom: active ? `2px solid ${GREEN}` : "2px solid transparent",
                color: active ? GREEN : "#8B8D86", fontWeight: 600, fontSize: 12.5
              }}>
                <Icon size={14} /> {t.name}
              </button>
            );
          })}
        </div>

        {activePrayerTab === "history" && <PrayerHistoryTab />}
        {activePrayerTab === "today" && <PrayerComingSoon label="Today's Prayers" />}
        {activePrayerTab === "stats" && <PrayerComingSoon label="Stats" />}
        {activePrayerTab === "goals" && <PrayerComingSoon label="Goals" />}
        {activePrayerTab === "calendar" && <PrayerComingSoon label="Calendar" />}

        {/* Bottom-style local nav (mirrors reference image) */}
        <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "8px 4px", marginTop: 20 }}>
          {prayerBottomTabs.map(t => {
            const Icon = t.icon;
            const active = t.key === "prayer";
            return (
              <button key={t.key} style={{
                background: "none", border: "none", cursor: "pointer", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 2px"
              }}>
                <Icon size={17} color={active ? GREEN : "#9a9c95"} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: active ? GREEN : "#9a9c95" }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ service, onBack }) {
  const Icon = service.icon;
  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: GREEN, fontWeight: 600, fontSize: 14, padding: 0, marginBottom: 24, cursor: "pointer" }}
      >
        ← Back to home
      </button>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: service.bg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
      }}>
        <Icon size={28} color={service.fg} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#1A1A1A" }}>{service.name}</h2>
      <p style={{ margin: 0, color: "#6b6d66", fontSize: 14.5, lineHeight: 1.6 }}>
        This is a placeholder for the {service.name} module. Tell me what it should track or
        let me know its key screens, and I'll build it out next.
      </p>
    </div>
  );
}

const allServicesList = [
  { key: "hostel", name: "Hostel", icon: BedDouble, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "school", name: "School", icon: GraduationCap, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "health", name: "Health", icon: HeartPulse, bg: "#FCE9EB", fg: "#E0435A" },
  { key: "finance", name: "Finance", icon: Wallet, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "daily-task", name: "Daily Task", icon: ClipboardCheck, bg: "#EFEAFB", fg: "#6E4FD1" },
  { key: "travel", name: "Travel", icon: Briefcase, bg: "#E3F4F8", fg: "#1CA6C2" },
  { key: "family", name: "Family Tree", icon: Users, bg: "#E7F3E6", fg: "#4C9A3E" },
  { key: "prayer", name: "Prayer", icon: Landmark, bg: "#EFEAFB", fg: "#6E4FD1" },
];

function ProfileScreen({ onBack }) {
  const currentUser = useCurrentUser();
  const name = currentUser?.name || "New User";
  const email = currentUser?.email || "";
  const initials = currentUser?.initials || "NA";

  const profileMenu = [
    { key: "edit", name: "Edit Profile", icon: User },
    { key: "notifications", name: "Notification Settings", icon: Bell },
    { key: "privacy", name: "Privacy & Security", icon: Shield },
    { key: "settings", name: "App Settings", icon: Settings },
    { key: "help", name: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #ECEDE8",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <ArrowLeft size={18} color="#1A1A1A" />
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#1A1A1A" }}>Profile</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        {/* Identity card */}
        <div style={{
          background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)", borderRadius: 18, padding: 20,
          display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0 16px", textAlign: "center"
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%", background: "#fff", border: "3px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 26, color: GREEN, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>{initials}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{name}</div>
          <div style={{ fontSize: 12.5, color: "#6b6d66", marginTop: 2 }}>{email}</div>
          <div style={{ marginTop: 12 }}>
            <CareIdBadge />
          </div>
        </div>

        {/* Quick contact info */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0F1EC" }}>
            <Phone size={16} color="#2F6FE0" />
            <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>Add a phone number</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
            <Mail size={16} color="#E08A20" />
            <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{email}</span>
          </div>
        </div>

        {/* Menu list */}
        <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px", marginBottom: 16 }}>
          {profileMenu.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={m.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                borderBottom: i < profileMenu.length - 1 ? "1px solid #F0F1EC" : "none", cursor: "pointer"
              }}>
                <Icon size={17} color="#6b6d66" />
                <span style={{ fontSize: 13.5, color: "#1A1A1A", flex: 1 }}>{m.name}</span>
                <ChevronRight size={16} color="#c7c8c2" />
              </div>
            );
          })}
        </div>

        <button onClick={() => signOut(auth)} style={{
          width: "100%", background: "#FCE9EB", border: "none", borderRadius: 14, color: "#E0435A",
          padding: "13px 0", fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 20
        }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}

function MenuDrawer({ open, onClose, onSelectService, onOpenProfile }) {
  const currentUser = useCurrentUser();
  const name = currentUser?.name || "New User";
  const initials = currentUser?.initials || "NA";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40,
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.2s"
        }}
      />
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "78%", maxWidth: 300,
        background: "#fff", zIndex: 41, boxShadow: "2px 0 16px rgba(0,0,0,0.12)",
        transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.22s ease",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <div style={{ padding: "20px 18px 14px", background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <CareLogo size={36} />
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.7)", border: "none", borderRadius: "50%", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <X size={15} color="#1A1A1A" />
            </button>
          </div>
          <button onClick={() => { onOpenProfile(); onClose(); }} style={{
            display: "flex", alignItems: "center", gap: 10, background: "none", border: "none",
            padding: 0, marginTop: 14, cursor: "pointer", width: "100%", textAlign: "left"
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: GREEN, fontSize: 15
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>{name}</div>
              <div style={{ fontSize: 11, color: "#5b5d56" }}>View profile</div>
            </div>
          </button>
        </div>

        <div style={{ padding: "8px 10px" }}>
          <button onClick={onClose} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <HomeIcon size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Home</span>
          </button>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9c95", textTransform: "uppercase", padding: "12px 10px 4px" }}>
            My Services
          </div>
          {allServicesList.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => onSelectService(s)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
                padding: "10px 10px", cursor: "pointer", borderRadius: 10
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon size={15} color={s.fg} />
                </div>
                <span style={{ fontSize: 13.5, color: "#1A1A1A" }}>{s.name}</span>
              </button>
            );
          })}

          <div style={{ height: 1, background: "#F0F1EC", margin: "10px 10px" }} />

          <button onClick={() => { onOpenProfile(); onClose(); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <User size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Profile</span>
          </button>
          <button onClick={onClose} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <Settings size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Settings</span>
          </button>
          <button onClick={onClose} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10
          }}>
            <HelpCircle size={18} color="#1A1A1A" />
            <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>Help & Support</span>
          </button>
          <button onClick={() => { signOut(auth); onClose(); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none",
            padding: "12px 10px", cursor: "pointer", borderRadius: 10, color: "#E0435A"
          }}>
            <LogOut size={18} color="#E0435A" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function MyCareApp() {
  const currentUser = useCurrentUser();
  const [openService, setOpenService] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", background: "linear-gradient(180deg,#F3FAF6 0%,#F7F8F4 220px)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: 700, position: "relative", paddingBottom: 78,
      borderRadius: 28, overflow: "hidden", border: "1px solid #e7e8e2"
    }}>
      {showProfile ? (
        <ProfileScreen onBack={() => setShowProfile(false)} />
      ) : openService && openService.key === "health" ? (
        <HealthScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "family" ? (
        <FamilyScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "travel" ? (
        <TravelScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "hostel" ? (
        <HostelScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "school" ? (
        <SchoolScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "finance" ? (
        <FinanceScreen onBack={() => setOpenService(null)} />
      ) : openService && openService.key === "prayer" ? (
        <PrayerScreen onBack={() => setOpenService(null)} />
      ) : openService ? (
        <ServiceDetail service={openService} onBack={() => setOpenService(null)} />
      ) : (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setMenuOpen(true)} style={{
                width: 38, height: 38, borderRadius: 12, background: "#fff",
                border: "1px solid #ECEDE8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}>
                <Menu size={18} color="#1A1A1A" />
              </button>
              <CareLogo size={38} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16.5, color: "#1A1A1A" }}>My Care</div>
                <div style={{ fontSize: 10.5, color: "#8B8D86", lineHeight: 1.3 }}>Everything That Matters.<br />One Place.</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Search size={19} color="#1A1A1A" />
              <div style={{ position: "relative" }}>
                <Bell size={19} color="#1A1A1A" />
                <span style={{
                  position: "absolute", top: -6, right: -7, background: "#E0435A", color: "#fff",
                  fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>3</span>
              </div>
              <button onClick={() => setShowProfile(true)} style={{
                width: 34, height: 34, borderRadius: "50%", background: "#E4F3EA", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer"
              }}>
                <span style={{ fontWeight: 700, fontSize: 12.5, color: GREEN }}>{currentUser?.initials || "NA"}</span>
              </button>
            </div>
          </div>

          {/* Greeting banner */}
          <div style={{
            margin: "10px 20px", borderRadius: 18, padding: "22px 20px",
            background: "linear-gradient(135deg,#E4F3EA,#EAF6EF)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A" }}>Good Morning, {(currentUser?.name || "there").split(" ")[0]}! 👋</div>
            <div style={{ fontSize: 13, color: "#5b5d56", marginTop: 6, maxWidth: 220, lineHeight: 1.5 }}>
              Have a great day! Stay organized, productive and take care.
            </div>
          </div>

          <div style={{ padding: "6px 20px 0" }}>
            <div style={{ margin: "8px 0 0" }}>
              <CareIdBadge compact />
            </div>
            {/* My Services */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
                <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>My Services</span>
              </div>
              <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
                See All <ChevronRight size={14} />
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {services.map(s => <ServiceCard key={s.key} s={s} onOpen={setOpenService} />)}
            </div>

            {/* Add / Manage */}
            <button style={{
              width: "100%", marginTop: 14, background: "#E4F3EA", border: "none", borderRadius: 14,
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: GREEN,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Plus size={18} color="#fff" />
              </div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1A1A1A" }}>Add / Manage Services</div>
                <div style={{ fontSize: 12, color: "#6b6d66" }}>Add new services or manage your services</div>
              </div>
              <ChevronRight size={18} color="#1A1A1A" />
            </button>

            {/* Quick Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 10px" }}>
              <div style={{ width: 4, height: 16, background: GREEN, borderRadius: 2 }} />
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Quick Actions</span>
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {quickActions.map(q => <QuickAction key={q.key} q={q} />)}
            </div>

            {/* Recent Activity + Notice board */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Recent Activity</span>
              <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid #ECEDE8", borderRadius: 14, padding: "6px 14px" }}>
              {activity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={a.key} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", margin: "6px 0",
                    borderLeft: `3px solid ${a.fg}`, background: a.bg, borderRadius: 10
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.7)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <Icon size={16} color={a.fg} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A1A" }}>{a.title}</div>
                      <div style={{ fontSize: 11.5, color: "#6b6d66" }}>{a.meta}</div>
                    </div>
                    <ChevronRight size={16} color="#a8a9a2" />
                  </div>
                );
              })}
            </div>

            {/* Notice board */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>Notice Board</span>
              <span style={{ color: GREEN, fontWeight: 600, fontSize: 13 }}>View All</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "#FDF6E9", border: "1px solid #F5E7C4", borderRadius: 14, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Star size={15} color="#E08A20" />
                  <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: "#1A1A1A" }}>Hostel Meeting</span>
                  <span style={{ color: "#E0435A", fontWeight: 600, fontSize: 11.5 }}>Important</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>
                  A general meeting will be held today at 7:00 PM in the common room.
                </div>
                <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>17 June 2025 · 09:00 AM</div>
              </div>
              <div style={{ background: "#EAF1FC", border: "1px solid #D3E2F7", borderRadius: 14, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Info size={15} color="#2F6FE0" />
                  <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: "#1A1A1A" }}>School Examination</span>
                  <span style={{ color: "#2F6FE0", fontWeight: 600, fontSize: 11.5, background: "#fff", padding: "2px 8px", borderRadius: 999 }}>Reminder</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#6b6d66", lineHeight: 1.5 }}>
                  Final examination will start from 22 June 2025.
                </div>
                <div style={{ fontSize: 11, color: "#9a9c95", marginTop: 6 }}>17 June 2025 · 08:30 AM</div>
              </div>
            </div>

            {/* Motivation banner */}
            <div style={{
              margin: "20px 0", borderRadius: 16, padding: "16px 18px",
              background: "#EAF6EF", display: "flex", alignItems: "center", gap: 12
            }}>
              <Trophy size={26} color="#E08A20" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>Keep going, Rakib! 🎉</div>
                <div style={{ fontSize: 12, color: "#6b6d66" }}>Complete your tasks and achieve your goals.</div>
              </div>
              <button style={{
                background: GREEN, color: "#fff", border: "none", borderRadius: 10,
                padding: "8px 12px", fontSize: 12, fontWeight: 600, display: "flex",
                alignItems: "center", gap: 4, whiteSpace: "nowrap", cursor: "pointer"
              }}>
                View Tasks <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff",
        borderTop: "1px solid #ECEDE8", display: "flex", justifyContent: "space-around",
        alignItems: "center", padding: "10px 4px 14px"
      }}>
        {[
          { key: "home", label: "Home", icon: HomeIcon },
          { key: "search", label: "Search", icon: Search },
        ].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setOpenService(null); }}
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <t.icon size={20} color={activeTab === t.key ? GREEN : "#9a9c95"} />
            <span style={{ fontSize: 10.5, color: activeTab === t.key ? GREEN : "#9a9c95", fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
        <button onClick={() => setOpenService(null)} style={{
          width: 48, height: 48, borderRadius: "50%", background: GREEN_DARK, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", marginTop: -22,
          boxShadow: "0 4px 10px rgba(31,138,90,0.35)", cursor: "pointer"
        }}>
          <Plus size={22} color="#fff" />
        </button>
        <button onClick={() => setActiveTab("notif")} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", position: "relative" }}>
          <Bell size={20} color={activeTab === "notif" ? GREEN : "#9a9c95"} />
          <span style={{
            position: "absolute", top: -4, right: 6, background: "#E0435A", color: "#fff",
            fontSize: 8, fontWeight: 700, borderRadius: "50%", width: 13, height: 13,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>3</span>
          <span style={{ fontSize: 10.5, color: activeTab === "notif" ? GREEN : "#9a9c95", fontWeight: 600 }}>Notifications</span>
        </button>
        <button onClick={() => setShowProfile(true)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
          <User size={20} color={activeTab === "profile" ? GREEN : "#9a9c95"} />
          <span style={{ fontSize: 10.5, color: activeTab === "profile" ? GREEN : "#9a9c95", fontWeight: 600 }}>Profile</span>
        </button>
      </div>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenProfile={() => setShowProfile(true)}
        onSelectService={(s) => { setOpenService(s); setMenuOpen(false); }}
      />
    </div>
  );
}
