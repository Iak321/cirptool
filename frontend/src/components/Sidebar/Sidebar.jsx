import React from "react";
import "./sidebar.css";
import axios from "axios";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const handleLogout = () => {
    axios
      .post("/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // Clear token from localStorage regardless of API response
        localStorage.removeItem("token");
        // Redirect to login page
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
        // Even if API call fails, still clear token and redirect
        localStorage.removeItem("token");
        navigate("/login");
      });
  };

  const menuItems = [
    { id: "reports", label: "Reports" },
    { id: "company", label: "Company" },
    { id: "chats", label: "Chats" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeComponent === item.id ? "active" : ""}
              onClick={() => setActiveComponent(item.id)}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
