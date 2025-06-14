import React, { useState, useEffect } from "react";
import { ticketService } from "../../../services/api";
import "./EditTickets.css"; // create this file based on your createTicket.css

const EditTickets = ({ ticketData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    severity: ticketData?.severity || "low",
    timeframe: {
      start: ticketData?.start_date || "",
      end: ticketData?.end_date || "",
      ongoing: ticketData?.is_ongoing || false,
    },
    description: ticketData?.description || "",
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["start", "end"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        timeframe: { ...prev.timeframe, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      timeframe: { ...prev.timeframe, ongoing: e.target.checked },
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload = new FormData();
    payload.append("severity", formData.severity);
    payload.append("start_date", formData.timeframe.start);
    if (!formData.timeframe.ongoing) {
      payload.append("end_date", formData.timeframe.end);
    }
    payload.append("is_ongoing", formData.timeframe.ongoing);
    payload.append("description", formData.description);
    if (formData.files.length) {
      formData.files.forEach((file, idx) =>
        payload.append(`files[${idx}]`, file)
      );
    }

    try {
      await ticketService.updateTicket(ticketData.id, payload);
      onUpdate(); // refresh parent data
      onClose(); // close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Ticket</h3>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Severity Level:</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}>
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
                value={formData.timeframe.start}
                onChange={handleChange}
              />
              <input
                type="date"
                name="end"
                value={formData.timeframe.end}
                onChange={handleChange}
                disabled={formData.timeframe.ongoing}
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.timeframe.ongoing}
                  onChange={handleCheckboxChange}
                />
                <span>Ongoing</span>
              </label>
            </div>
          </div>

          <div className="form-field">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Attachments:</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Ticket"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTickets;
