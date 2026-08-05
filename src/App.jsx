import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import HomePage from "./pages/Home";

// Every other page is code-split: its JS is only downloaded when the user
// actually navigates there, instead of all being bundled into one big file
// loaded on first visit.
const ProfilePage = lazy(() => import("./pages/Profile"));
const EditProfilePage = lazy(() => import("./pages/EditProfile"));
const NotificationSettingsPage = lazy(() => import("./pages/NotificationSettings"));
const PrivacySecurityPage = lazy(() => import("./pages/PrivacySecurity"));
const AppSettingsPage = lazy(() => import("./pages/AppSettings"));
const HelpSupportPage = lazy(() => import("./pages/HelpSupport"));
const FaqPage = lazy(() => import("./pages/Faq"));
const FeedbackFormPage = lazy(() => import("./pages/FeedbackForm"));
const LegalPage = lazy(() => import("./pages/Legal"));

const HealthPage = lazy(() => import("./modules/health/pages/HealthPage"));
const FamilyPage = lazy(() => import("./modules/family/pages/FamilyPage"));
const TravelPage = lazy(() => import("./modules/travel/pages/TravelPage"));
const FinancePage = lazy(() => import("./modules/finance/pages/FinancePage"));
const PrayerPage = lazy(() => import("./modules/prayer/pages/PrayerPage"));
const SchoolPage = lazy(() => import("./modules/school/pages/SchoolPage"));
const CareerPage = lazy(() => import("./modules/career/pages/CareerPage"));
const DailyTaskPage = lazy(() => import("./modules/daily-task/pages/DailyTaskPage"));

const HostelLayout = lazy(() => import("./modules/hostel/pages/HostelLayout"));
const HostelDashboard = lazy(() => import("./modules/hostel/pages/Dashboard"));
const HostelStudents = lazy(() => import("./modules/hostel/pages/Students"));
const HostelMeals = lazy(() => import("./modules/hostel/pages/Meals"));
const HostelRent = lazy(() => import("./modules/hostel/pages/Rent"));
const HostelReports = lazy(() => import("./modules/hostel/pages/Reports"));

function PageLoading() {
  return (
    <div style={{
      padding: "80px 20px", textAlign: "center", color: "#8B8D86",
      fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
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
    </Suspense>
  );
}
