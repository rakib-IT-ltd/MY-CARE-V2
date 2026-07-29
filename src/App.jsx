import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import EditProfilePage from "./pages/EditProfile";
import NotificationSettingsPage from "./pages/NotificationSettings";
import PrivacySecurityPage from "./pages/PrivacySecurity";
import AppSettingsPage from "./pages/AppSettings";
import HelpSupportPage from "./pages/HelpSupport";
import FaqPage from "./pages/Faq";
import FeedbackFormPage from "./pages/FeedbackForm";
import LegalPage from "./pages/Legal";
import HealthPage from "./modules/health/pages/HealthPage";
import FamilyPage from "./modules/family/pages/FamilyPage";
import TravelPage from "./modules/travel/pages/TravelPage";
import FinancePage from "./modules/finance/pages/FinancePage";
import PrayerPage from "./modules/prayer/pages/PrayerPage";
import SchoolPage from "./modules/school/pages/SchoolPage";
import CareerPage from "./modules/career/pages/CareerPage";
import DailyTaskPage from "./modules/daily-task/pages/DailyTaskPage";
import HostelLayout from "./modules/hostel/pages/HostelLayout";
import HostelDashboard from "./modules/hostel/pages/Dashboard";
import HostelStudents from "./modules/hostel/pages/Students";
import HostelMeals from "./modules/hostel/pages/Meals";
import HostelRent from "./modules/hostel/pages/Rent";
import HostelReports from "./modules/hostel/pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/notifications" element={<NotificationSettingsPage />} />
        <Route path="/profile/privacy" element={<PrivacySecurityPage />} />
        <Route path="/profile/settings" element={<AppSettingsPage />} />
        <Route path="/profile/help" element={<HelpSupportPage />} />
        <Route path="/profile/help/faq" element={<FaqPage />} />
        <Route path="/profile/help/feedback/:type" element={<FeedbackFormPage />} />
        <Route path="/profile/help/legal/:doc" element={<LegalPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/prayer" element={<PrayerPage />} />
        <Route path="/school" element={<SchoolPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/daily-task" element={<DailyTaskPage />} />

        <Route path="/hostel" element={<HostelLayout />}>
          <Route index element={<HostelDashboard />} />
          <Route path="students" element={<HostelStudents />} />
          <Route path="meals" element={<HostelMeals />} />
          <Route path="rent" element={<HostelRent />} />
          <Route path="reports" element={<HostelReports />} />
        </Route>
      </Route>
    </Routes>
  );
}
