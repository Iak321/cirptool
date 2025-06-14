import React, { useState } from "react";
import SearchIncidents from "../SearchIncidents/SearchIncidents";
import { ticketService } from "../../services/api";
import "./createTicket.css";

const CreateTicket = () => {
  const [ticket, setTicket] = useState({
    title: "",
    people: "",
    incidents: [],
    customCategory: "",
    severity: "low",
    timeframe: {
      start: "",
      end: "",
      ongoing: true,
    },
    description: "",
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectIncidents = (incident) => {
    setTicket((prevTicket) => {
      const uniqueKey = incident.cve_id || incident.id || incident.title;

      const alreadySelected = prevTicket.incidents.find(
        (i) => (i.cve_id || i.id || i.title) === uniqueKey
      );
      if (alreadySelected) {
        return prevTicket; // Prevent duplicates
      }

      const updatedIncidents = [...prevTicket.incidents, incident].slice(0, 5);

      return {
        ...prevTicket,
        incidents: updatedIncidents,
        description:
          prevTicket.description.trim() === "" && incident.description
            ? incident.description
            : prevTicket.description,
      };
    });
  };

  const handleRemoveIncident = (keyToRemove) => {
    setTicket((prev) => ({
      ...prev,
      incidents: prev.incidents.filter(
        (i) => (i.cve_id || i.id || i.title) !== keyToRemove
      ),
    }));
  };

  const handleFileChange = (e) => {
    setTicket({
      ...ticket,
      files: Array.from(e.target.files),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticket.title) {
      setSubmitMessage({
        type: "error",
        text: "Please provide a ticket title",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const response = await ticketService.createTicket(ticket);
      setSubmitMessage({
        type: "success",
        text: "Ticket created successfully!",
      });

      setTicket({
        title: "",
        people: "",
        incidents: [],
        customCategory: "",
        severity: "low",
        timeframe: {
          start: "",
          end: "",
          ongoing: true,
        },
        description: "",
        files: [],
      });
    } catch (error) {
      console.error("Error creating ticket:", error.message);
      setSubmitMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <h3>Create New Incident Ticket</h3>

      {submitMessage.text && (
        <div className={`alert alert-${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Enter ticket title"
            value={ticket.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="people">Select 1 or more people:</label>
          <input
            type="text"
            name="people"
            placeholder="Enter people's names or emails"
            value={ticket.people}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="incidents">Search CVEs (up to 5):</label>
          <SearchIncidents
            onSelect={handleSelectIncidents}
            selectedIncidents={ticket.incidents}
          />
        </div>

        {/* Show selected incidents with remove option */}
        {ticket.incidents.length > 0 && (
          <div className="selected-incidents-list">
            <h4>Selected Incidents (up to 5):</h4>
            <ul>
              {ticket.incidents.map((incident) => {
                const key = incident.cve_id || incident.id || incident.title;
                return (
                  <li key={key}>
                    {incident.title || incident.cve_id}
                    <button
                      type="button"
                      onClick={() => handleRemoveIncident(key)}
                      style={{ marginLeft: "10px" }}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="form-field">
          <label htmlFor="customCategory">Set a Custom Category (Optional):</label>
          <input
            type="text"
            name="customCategory"
            placeholder="Enter a custom incident category"
            value={ticket.customCategory}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Set Severity Level:</label>
          <select
            name="severity"
            value={ticket.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-field">
          <label>Timeframe:</label>
          <div className="timeframe-container">
            <input
              type="date"
              name="start"
              value={ticket.timeframe.start}
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  timeframe: { ...ticket.timeframe, start: e.target.value },
                })
              }
              required
            />
            <input
              type="date"
              name="end"
              value={ticket.timeframe.end}
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  timeframe: { ...ticket.timeframe, end: e.target.value },
                })
              }
              disabled={ticket.timeframe.ongoing}
            />
            <label>
              <input
                type="checkbox"
                checked={ticket.timeframe.ongoing}
                onChange={(e) =>
                  setTicket({
                    ...ticket,
                    timeframe: {
                      ...ticket.timeframe,
                      ongoing: e.target.checked,
                    },
                  })
                }
              />
              <span>Ongoing</span>
            </label>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description">Further Description:</label>
          <textarea
            name="description"
            placeholder="Provide further details about the incident..."
            value={ticket.description}
            onChange={handleChange}
          />
          {ticket.description &&
            ticket.incidents.length > 0 &&
            ticket.description ===
              ticket.incidents.find((i) => i.description)?.description && (
              <small className="info-text">
                Description auto-filled from selected incident. You may edit it.
              </small>
            )}
        </div>

        <div className="form-field">
          <label htmlFor="files">Attach Supporting Documents:</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
