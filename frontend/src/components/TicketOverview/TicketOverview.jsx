import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registering required components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const TicketOverview = ({ tickets }) => {
  const getTicketStatusData = () => {
    const statusCount = { solved: 0, remaining: 0, active: 0 };

    tickets.forEach((ticket) => {
      if (ticket.done) statusCount.solved++;
      else statusCount.remaining++;
      if (ticket.status === "active") statusCount.active++;
    });

    return {
      labels: ["Solved", "Remaining", "Active"],
      datasets: [
        {
          data: [statusCount.solved, statusCount.remaining, statusCount.active],
          backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };
  };

  const getSeverityData = () => {
    const severityCount = { low: 0, medium: 0, high: 0, critical: 0 };

    tickets.forEach((ticket) => {
      if (ticket.severity === "low") severityCount.low++;
      if (ticket.severity === "medium") severityCount.medium++;
      if (ticket.severity === "high") severityCount.high++;
      if (ticket.severity === "critical") severityCount.critical++;
    });

    return {
      labels: ["Low", "Medium", "High", "Critical"],
      datasets: [
        {
          data: [
            severityCount.low,
            severityCount.medium,
            severityCount.high,
            severityCount.critical,
          ],
          backgroundColor: ["#8BC34A", "#FFC107", "#FF5722", "#F44336"],
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };
  };

  return (
    <div className="overview-container">
      <div className="pie-chart-container">
        <div className="pie-chart">
          <h3>Ticket Status</h3>
          <Pie data={getTicketStatusData()} />
        </div>
        <div className="pie-chart">
          <h3>Severity Scale</h3>
          <Pie data={getSeverityData()} />
        </div>
      </div>
    </div>
  );
};

export default TicketOverview;
