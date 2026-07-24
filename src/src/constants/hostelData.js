import {
  Users, BedDouble, Coins, UserRound, Sun, Moon, CheckCircle2, Utensils, UserPlus,
  Home as HomeIcon, Banknote, Receipt, User, Star, Info,
} from "lucide-react";

export const managerStats = [
  { key: "students", icon: Users, bg: "#E4F3EA", fg: "#1F8A5A", value: "186", label: "Students", sub: "Active" },
  { key: "rooms", icon: BedDouble, bg: "#E5EFFC", fg: "#2F6FE0", value: "69 / 86", label: "Rooms", sub: "Occupied / Total" },
  { key: "due", icon: Coins, bg: "#FDF0DF", fg: "#E08A20", value: "৳ 35,400", label: "Outstanding Due", sub: "All Students" },
  { key: "guests", icon: UserRound, bg: "#EFEAFB", fg: "#6E4FD1", value: "12", label: "Guests Today", sub: "Current Guests" },
];

export const mealsSummary = [
  { key: "breakfast", icon: Sun, fg: "#1F8A5A", value: "120", label: "Breakfast" },
  { key: "lunch", icon: Sun, fg: "#2F6FE0", value: "128", label: "Lunch" },
  { key: "dinner", icon: Moon, fg: "#E08A20", value: "115", label: "Dinner" },
  { key: "total", icon: CheckCircle2, fg: "#1F8A5A", value: "363", label: "Total" },
];

export const menuToday = [
  { key: "breakfast", name: "Breakfast", items: 2, icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", items: 3, icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", items: 3, icon: Moon, fg: "#E08A20" },
];

export const recentActivities = [
  { key: "menu", title: "Menu updated for Lunch", meta: "Today, 10:30 AM", icon: Utensils, bg: "#E5EFFC", fg: "#2F6FE0" },
  { key: "student", title: "New student added", meta: "Today, 09:15 AM", icon: UserPlus, bg: "#E4F3EA", fg: "#1F8A5A" },
  { key: "payment", title: "Payment received from Abir Hossain", meta: "Today, 08:40 AM", icon: Coins, bg: "#FDF0DF", fg: "#E08A20" },
  { key: "checkin", title: "Guest check-in by Rakib Hasan", meta: "Today, 08:20 AM", icon: UserRound, bg: "#EFEAFB", fg: "#6E4FD1" },
];

export const managerTabs = [
  { key: "dashboard", name: "Dashboard", icon: HomeIcon },
  { key: "students", name: "Students", icon: Users },
  { key: "meals", name: "Meals", icon: Utensils },
  { key: "rent", name: "Rent", icon: Banknote },
  { key: "reports", name: "Reports", icon: Receipt },
];

export const studentTopStats = [
  { key: "room", icon: BedDouble, bg: "#E4F3EA", fg: "#1F8A5A", value: "102", label: "My Room", sub: "Bed 2" },
  { key: "plan", icon: Utensils, bg: "#E5EFFC", fg: "#2F6FE0", value: "3 / Day", label: "Meal Plan", sub: "B, L, D" },
  { key: "rent", icon: Banknote, bg: "#FDF0DF", fg: "#E08A20", value: "৳ 4,000", label: "Monthly Rent", sub: "Due on 5 Jul 2025" },
  { key: "due", icon: Coins, bg: "#EFEAFB", fg: "#6E4FD1", value: "৳ 0", label: "Due Amount", sub: "All Paid" },
];

export const studentMeals = [
  { key: "breakfast", name: "Breakfast", time: "7:30 AM - 9:00 AM", items: "Egg, Bread, Tea, Banana +1 more", status: "Completed", statusColor: "#1F8A5A", statusBg: "#E4F3EA", icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", time: "12:30 PM - 2:00 AM", items: "Rice, Dal, Fish, Vegetable +2 more", status: "Upcoming", statusColor: "#2F6FE0", statusBg: "#E5EFFC", icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", time: "7:30 PM - 9:00 PM", items: "Rice, Chicken Curry, Vegetable +1 more", status: "Upcoming", statusColor: "#E08A20", statusBg: "#FDF0DF", icon: Moon, fg: "#E08A20" },
];

export const studentMenu = [
  { key: "breakfast", name: "Breakfast", items: 4, icon: Sun, fg: "#1F8A5A" },
  { key: "lunch", name: "Lunch", items: 4, icon: Sun, fg: "#2F6FE0" },
  { key: "dinner", name: "Dinner", items: 4, icon: Moon, fg: "#E08A20" },
];

export const studentNotices = [
  { key: "meeting", title: "Hostel meeting", body: "A general meeting will be held on 20 June 2025 at 7:00 PM.", meta: "17 Jun 2025 · 09:00 AM", icon: Star, bg: "#FDF6E9", border: "#F5E7C4", fg: "#E08A20" },
  { key: "rent", title: "Rent collection", body: "Please collect the pending rent from all students by the end of this month.", meta: "16 Jun 2025 · 04:30 PM", icon: Info, bg: "#EAF1FC", border: "#D3E2F7", fg: "#2F6FE0" },
];

export const studentTabs = [
  { key: "dashboard", name: "Dashboard", icon: HomeIcon },
  { key: "meals", name: "My Meals", icon: Utensils },
  { key: "rent", name: "My Rent", icon: Banknote },
  { key: "guests", name: "My Guests", icon: Users },
  { key: "profile", name: "Profile", icon: User },
];
