import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown, ArrowUp, ArrowRight, ArrowLeftRight, Bell, ChevronDown, ChevronRight,
  Lightbulb, Menu, Target, Wallet, PiggyBank, FileText, PieChart as PieChartIcon,
  Utensils, Car, ShoppingBag, MoreHorizontal, Zap, Wifi, Droplet, Home as HomeIcon,
  User, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { GREEN, FIN_GREEN, FIN_BLUE, FIN_ORANGE, FIN_PURPLE, FIN_RED } from "../../../constants/colors";
import CareLogo from "../../../components/CareLogo";
import CareIdBadge from "../../../components/CareIdBadge";
import SectionTitle from "../../../components/SectionTitle";

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

export default function FinancePage() {
  const navigate = useNavigate();
  const [activeFinTab, setActiveFinTab] = useState("finance");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
        <button onClick={() => navigate(-1)} style={{
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
        <SectionTitle action="View All">Recent Transactions</SectionTitle>
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
        <SectionTitle action="View All">Upcoming Bills</SectionTitle>
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

