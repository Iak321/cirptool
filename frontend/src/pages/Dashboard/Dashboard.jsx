import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import Profile from "../../components/Profile/Profile";
import Reports from "../../components/Reports/Reports";
import CompanyDetails from "../../components/CompanyDetails/CompanyDetails";
import Chats from "../../components/Chats/Chats";
import "./dashboard.css";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("reports");

  const renderComponent = () => {
    switch (activeComponent) {
      case "reports":
        return <Reports />;
      case "profile":
        return <Profile />;
      case "company":
        return <CompanyDetails />;
      case "chats":
        return <Chats />;
      default:
        return <Reports />;
    }
  };

  return (
    <>
      <DashboardLayout
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}>
        {renderComponent()}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
