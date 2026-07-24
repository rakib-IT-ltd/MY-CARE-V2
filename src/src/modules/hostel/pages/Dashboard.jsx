import React from "react";
import { useOutletContext } from "react-router-dom";
import ManagerDashboard from "./ManagerDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  const { role, currentUser, hostelId, hostelInfo, students, handleAccepted } = useOutletContext();

  if (role === "manager") {
    return <ManagerDashboard currentUser={currentUser} hostelId={hostelId} hostelInfo={hostelInfo} students={students} />;
  }
  return <StudentDashboard currentUser={currentUser} hostelId={hostelId} hostelInfo={hostelInfo} onAccepted={handleAccepted} />;
}
