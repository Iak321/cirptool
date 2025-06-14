import React from "react";
import "./ExportModal.css";
import { pdf } from "@react-pdf/renderer";
import TicketPDF from "../../TicketPDF/TicketPDF";
import { Document, Packer, Paragraph, TextRun } from "docx";
import TicketPreview from "../../previews/TicketPreview";
import { saveAs } from "file-saver";

const ExportModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handleExportPDF = async () => {
    try {
      const blob = await pdf(<TicketPDF ticket={ticket} />).toBlob();
      saveAs(blob, "ticket_report.pdf");
    } catch (err) {
      console.error("Error exporting PDF:", err);
    }
  };

  const handleExportWord = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Incident Report Summary",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph(""),

              new Paragraph(`Title: ${ticket.title}`),
              new Paragraph(
                `Reported by: ${ticket.created_by?.username || "N/A"} (${
                  ticket.created_by?.email || "N/A"
                })`
              ),
              new Paragraph(`Status: ${ticket.status}`),
              new Paragraph(`Severity: ${ticket.severity}`),
              new Paragraph(`Category: ${ticket.category?.name || "N/A"}`),
              new Paragraph(`Start Date: ${ticket.start_date || "N/A"}`),
              new Paragraph(
                `End Date: ${
                  ticket.end_date || (ticket.is_ongoing ? "Ongoing" : "N/A")
                }`
              ),
              new Paragraph(`Created At: ${ticket.created_at}`),
              new Paragraph(""),

              new Paragraph({
                children: [new TextRun({ text: "Description:", bold: true })],
              }),
              new Paragraph(ticket.description || "No description provided."),
              new Paragraph(""),

              new Paragraph({
                children: [new TextRun({ text: "Incidents:", bold: true })],
              }),
              ...(ticket.incidents.length > 0
                ? ticket.incidents.map(
                    (incident, index) =>
                      new Paragraph(
                        `${index + 1}. ${incident.description || "No detail"}`
                      )
                  )
                : [new Paragraph("No incidents linked.")]),

              new Paragraph(""),

              new Paragraph({
                children: [new TextRun({ text: "Attachments:", bold: true })],
              }),
              ...(ticket.attachments.length > 0
                ? ticket.attachments.map(
                    (file, idx) =>
                      new Paragraph(
                        `${idx + 1}. ${
                          file.file?.split("/").pop() || "Unknown file"
                        }`
                      )
                  )
                : [new Paragraph("No attachments.")]),

              new Paragraph(""),
              new Paragraph({
                children: [new TextRun("End of Report")],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "ticket_report.docx");
    } catch (err) {
      console.error("Error exporting Word document:", err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="export-modal-overlay show" onClick={handleClose}>
      <div className="export-modal show" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>Export Ticket</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>

        <TicketPreview ticket={ticket} />

        <div className="export-section">
          <h4 className="section-title">Export Formats</h4>
          <button className="export-btn" onClick={handleExportPDF}>
            Download as PDF
          </button>
          <button className="export-btn secondary" onClick={handleExportWord}>
            Download as Word
          </button>
        </div>

        <div className="export-modal-footer">
          <button className="export-btn secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
