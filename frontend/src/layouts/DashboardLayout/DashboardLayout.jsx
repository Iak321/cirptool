import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./dashboardLayout.css";

const DashboardLayout = ({ children, activeComponent, setActiveComponent }) => {
  return (
    <div className="dashboard-content-area">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <main className="dashboard-main-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
