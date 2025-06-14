// ... imports remain the same
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../../services/api";
import ExportModal from "../modals/ExportTicket/ExportModal";
import EditTickets from "../modals/EditTickets/EditTickets";
import "./ViewTickets.css";

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [exportTicket, setExportTicket] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTicketData, setEditTicketData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  const recentlyExportedId = localStorage.getItem("lastExportedTicketId");

  useEffect(() => {
    fetchUserTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) fetchTicketDetails(selectedTicket);
    else setTicketDetails(null);
  }, [selectedTicket]);

  useEffect(() => {
    if (exportTicket) {
      localStorage.setItem("lastExportedTicketId", exportTicket.id);
    }
  }, [exportTicket]);

  const fetchUserTickets = async () => {
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data.reverse()); // latest first
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    setDetailsLoading(true);
    try {
      const data = await ticketService.getTicketDetails(ticketId);
      setTicketDetails(data);
    } catch {
      setError("Failed to load ticket details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditTicketData(ticketDetails);
    setIsEditModalOpen(true);
  };

  const getStatusBadgeClass = (status) =>
    `status-badge ${status.toLowerCase()}`;
  const getSeverityBadgeClass = (severity) =>
    `severity-badge ${severity.toLowerCase()}`;
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const handleExportClick = (ticket) => {
    const deepCopy = structuredClone(ticket);
    setExportTicket(deepCopy);
    setPreviewType(null);
  };

  const closeExportModal = () => {
    setExportTicket(null);
    setPreviewType(null);
  };

  const handleExportPDF = () => {
    console.log("Exporting as PDF...");
  };

  const handleExportWord = () => {
    console.log("Exporting as Word...");
  };

  const handlePreviewChange = (type) => {
    setPreviewType(type);
  };

  const renderTicketPreview = () => {
    if (!ticketDetails) return <p>No ticket details available.</p>;

    return (
      <div className="ticket-preview">
        <h3>{ticketDetails.title}</h3>
        <div className="ticket-actions">
          <button className="edit-button" onClick={handleEditClick}>
            Update Ticket
          </button>
          <button
            className="chat-button"
            onClick={(e) =>
              handleChatClick(e, ticketDetails.id, ticketDetails.title)
            }>
            Chat
          </button>
        </div>
        <p><strong>Status:</strong> {ticketDetails.status}</p>
        <p><strong>Severity:</strong> {ticketDetails.severity}</p>
        <p><strong>Created:</strong> {formatDate(ticketDetails.created_at)}</p>

        <div className="description">
          <h4>Description</h4>
          <p>{ticketDetails.description || "No description available"}</p>
        </div>

        <div className="timeframe">
          <h4>Timeframe</h4>
          <p>
            Start Date: {formatDate(ticketDetails.start_date)}
            <br />
            {ticketDetails.is_ongoing
              ? "Ongoing"
              : `End Date: ${formatDate(ticketDetails.end_date)}`}
          </p>
        </div>

        {ticketDetails.assigned_to_name && (
          <div className="assigned-to">
            <h4>Assigned To</h4>
            <p>{ticketDetails.assigned_to_name}</p>
          </div>
        )}

        {ticketDetails.attachments?.length > 0 && (
          <div className="attachments">
            <h4>Attachments</h4>
            <ul>
              {ticketDetails.attachments.map((a) => (
                <li key={a.id}>
                  <a href={a.file} target="_blank" rel="noopener noreferrer">
                    {a.file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handleChatClick = (e, ticketId, title) => {
    e.stopPropagation();
    navigate(`/tickets/${ticketId}/chat`);
  };

  if (loading)
    return <div className="loading-container">Loading tickets...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="view-tickets-container">
      <h2>My Tickets</h2>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
  <       option value="solved">Solved</option>
        </select>
      </div>

      {tickets.length === 0 ? (
        <div className="no-tickets">You haven't created any tickets yet.</div>
      ) : (
        <div className="tickets-list">
          {tickets
            .filter((ticket) =>
              ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((ticket) =>
              filterSeverity === "all"
                ? true
                : ticket.severity.toLowerCase() === filterSeverity
            )
            .filter((ticket) => {
              if (filterStatus === "all") return true;
              return ticket.status.toLowerCase() === filterStatus;
            })
            .map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-item ${
                  selectedTicket === ticket.id ? "selected" : ""
                } ${
                  recentlyExportedId === String(ticket.id)
                    ? "recent-export"
                    : ""
                }`}
                onClick={() =>
                  setSelectedTicket(
                    ticket.id === selectedTicket ? null : ticket.id
                  )
                }>
                <div className="ticket-header">
                  <div className="ticket-title">{ticket.title}</div>
                  <div className="ticket-badges">
                    <span className={getStatusBadgeClass(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1)}
                    </span>
                    <span className={getSeverityBadgeClass(ticket.severity)}>
                      {ticket.severity.charAt(0).toUpperCase() +
                        ticket.severity.slice(1)}
                    </span>
                  </div>
                  <button
                    className="export-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportClick(ticket);
                    }}>
                    Export
                  </button>
                </div>

                <div className="ticket-meta">
                  <span>Created: {formatDate(ticket.created_at)}</span>
                  {ticket.category_name && (
                    <span className="ticket-category">
                      {ticket.category_name}
                    </span>
                  )}
                </div>

                {selectedTicket === ticket.id && (
                  <div className="ticket-details">
                    {detailsLoading ? (
                      <div className="loading">Loading details...</div>
                    ) : ticketDetails ? (
                      renderTicketPreview()
                    ) : (
                      <div>No additional details available</div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {exportTicket && (
        <ExportModal
          ticket={exportTicket}
          previewType={previewType}
          onPreviewChange={handlePreviewChange}
          onClose={closeExportModal}
          onExportPDF={handleExportPDF}
          onExportWord={handleExportWord}
        />
      )}

      {isEditModalOpen && editTicketData && (
        <EditTickets
          ticketData={editTicketData}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTicketData(null);
          }}
          onUpdate={() => {
            fetchUserTickets();
            if (selectedTicket) fetchTicketDetails(selectedTicket);
          }}
        />
      )}
    </div>
  );
};

export default ViewTickets;
