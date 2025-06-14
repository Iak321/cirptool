import React, { useState, useEffect } from "react";
import "./companyDetails.css";

const CompanyDetails = () => {
  // Dummy data for company incidents and breach factors (for now)
  const [cyberIncidents, setCyberIncidents] = useState([]);
  const [breachFactors, setBreachFactors] = useState([]);

  // Fetch or load historical data (here, we're using dummy data for demonstration)
  useEffect(() => {
    // Simulate loading data
    setCyberIncidents([
      {
        type: "Phishing Attack",
        date: "2024-03-12",
        impact: "Emails with malicious attachments were sent to employees.",
        resolutionStatus: "Resolved",
        lessonsLearned: "Improved email filtering system.",
      },
      {
        type: "DDoS Attack",
        date: "2024-01-10",
        impact: "Company website was temporarily unavailable.",
        resolutionStatus: "Resolved",
        lessonsLearned: "Enhanced DDoS mitigation measures.",
      },
    ]);

    setBreachFactors([
      {
        vulnerability: "SQL Injection",
        exposureLevel: "High",
        resolutionAction: "Patching application and improving input validation",
        currentStatus: "Mitigated",
      },
      {
        vulnerability: "Cross-Site Scripting (XSS)",
        exposureLevel: "Medium",
        resolutionAction: "Implementing Content Security Policy (CSP)",
        currentStatus: "Ongoing",
      },
    ]);
  }, []);

  return (
    <div className="company-details-container">
      <h2>Company Info</h2>
      <p>Company: CyberSecure Inc.</p>
      <p>Role: Security Analyst</p>
      <p>Permissions: View, Create, Manage Reports</p>

      <h3>Company History of Cyber Incidents</h3>
      <table className="incident-table">
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Date</th>
            <th>Impact</th>
            <th>Resolution Status</th>
            <th>Lessons Learned</th>
          </tr>
        </thead>
        <tbody>
          {cyberIncidents.map((incident, index) => (
            <tr key={index}>
              <td>{incident.type}</td>
              <td>{incident.date}</td>
              <td>{incident.impact}</td>
              <td>{incident.resolutionStatus}</td>
              <td>{incident.lessonsLearned}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Breach Factors & Vulnerabilities</h3>
      <table className="breach-factors-table">
        <thead>
          <tr>
            <th>Vulnerability Type</th>
            <th>Exposure Level</th>
            <th>Resolution Action</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          {breachFactors.map((factor, index) => (
            <tr key={index}>
              <td>{factor.vulnerability}</td>
              <td>{factor.exposureLevel}</td>
              <td>{factor.resolutionAction}</td>
              <td>{factor.currentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add other relevant company info here */}
    </div>
  );
};

export default CompanyDetails;
