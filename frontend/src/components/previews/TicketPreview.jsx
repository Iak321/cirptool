import React from "react";
import "./TicketPreview.css";

const TicketPreview = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div className="ticket-preview">
      <h3>Report Preview</h3>

      <div className="preview-field">
        <strong>Title:</strong> {ticket.title}
      </div>

      <div className="preview-field">
        <strong>Reported By:</strong> {ticket.created_by?.username || "N/A"} (
        {ticket.created_by?.email || "N/A"})
      </div>

      <div className="preview-field">
        <strong>Status:</strong> {ticket.status}
      </div>

      <div className="preview-field">
        <strong>Severity:</strong> {ticket.severity}
      </div>

      <div className="preview-field">
        <strong>Category:</strong> {ticket.category?.name || "N/A"}
      </div>

      <div className="preview-field">
        <strong>Start Date:</strong> {ticket.start_date}
      </div>

      <div className="preview-field">
        <strong>End Date:</strong>{" "}
        {ticket.is_ongoing ? "Ongoing" : ticket.end_date || "N/A"}
      </div>

      <div className="preview-field">
        <strong>Created At:</strong> {ticket.created_at}
      </div>

      <div className="preview-section">
        <strong>Description:</strong>
        <p>{ticket.description || "No description provided."}</p>
      </div>

      <div className="preview-section">
        <strong>Incidents:</strong>
        {ticket.incidents.length > 0 ? (
          <ul>
            {ticket.incidents.map((incident, index) => (
              <li key={index}>
                {incident.description || "No detail provided"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No incidents reported.</p>
        )}
      </div>

      <div className="preview-section">
        <strong>Attachments:</strong>
        {ticket.attachments.length > 0 ? (
          <ul>
            {ticket.attachments.map((file, idx) => (
              <li key={idx}>{file.file?.split("/").pop() || "Unnamed file"}</li>
            ))}
          </ul>
        ) : (
          <p>No attachments provided.</p>
        )}
      </div>
    </div>
  );
};

export default TicketPreview;
