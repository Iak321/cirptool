import React, { useState, useEffect } from "react";
import TicketOverview from "../TicketOverview/TicketOverview";
import CreateTicket from "../CreateTicket/CreateTicket";
import ViewTickets from "../ViewTickets/ViewTickets";
import axios from "axios";
import "./reports.css";

const Reports = () => {
  const dummyTickets = [
    {
      title: "Security Breach",
      done: true,
      status: "active",
      severity: "critical",
    },
    { title: "Password Leak", done: false, status: "active", severity: "high" },
    {
      title: "SQL Injection",
      done: false,
      status: "active",
      severity: "medium",
    },
    {
      title: "Malware Attack",
      done: true,
      status: "resolved",
      severity: "low",
    },
    {
      title: "Ransomware Attack",
      done: false,
      status: "active",
      severity: "critical",
    },
    {
      title: "Phishing Attempt",
      done: true,
      status: "resolved",
      severity: "low",
    },
    {
      title: "Cross-Site Scripting",
      done: true,
      status: "resolved",
      severity: "medium",
    },
  ];

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("overview"); // Default view is 'overview'
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tickets/"); // or your deployed URL
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load tickets.");
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, []);
  const addTicket = (ticket) => {
    setTickets([...tickets, { ...ticket, done: false }]);
  };

  const updateTicket = (ticket, index) => {
    const updated = [...tickets];
    updated[index] = ticket;
    setTickets(updated);
  };

  const deleteTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const markAsDone = (index) => {
    const updated = [...tickets];
    updated[index].done = true;
    setTickets(updated);
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="reports-container">
      <h2>Incident Reports</h2>

      {/* Button for view selection */}
      <div className="reports-btn-container">
        <button
          className={`btn ${view === "overview" ? "active" : ""}`}
          onClick={() => handleViewChange("overview")}>
          Overview
        </button>
        <button
          className={`btn ${view === "createTicket" ? "active" : ""}`}
          onClick={() => handleViewChange("createTicket")}>
          Create Ticket
        </button>
        <button
          className={`btn ${view === "viewTickets" ? "active" : ""}`}
          onClick={() => handleViewChange("viewTickets")}>
          View Tickets
        </button>
      </div>

      {/* Conditionally render based on selected view */}
      {view === "overview" && <TicketOverview tickets={tickets} />}
      {view === "createTicket" && <CreateTicket onSubmit={addTicket} />}
      {view === "viewTickets" && (
        <ViewTickets
          tickets={tickets}
          updateTicket={updateTicket}
          deleteTicket={deleteTicket}
          markAsDone={markAsDone}
        />
      )}
    </div>
  );
};

export default Reports;
