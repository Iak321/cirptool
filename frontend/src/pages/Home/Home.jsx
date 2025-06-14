import React from "react";
import "./home.css"; // optional external CSS if you're not using Tailwind

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1 className="hero-title">Incident Response Plan Tool</h1>
        <p className="hero-subtitle">
          Secure. Structured. Simplified. Empower your organization to record,
          manage, report security incidents and make remediation plans with
          confidence.
        </p>
        <Link to="/signup">Get Started</Link>
        <p>
          Already a user? <Link to="/login">Login</Link>
        </p>
      </header>

      <section className="features">
        <div className="feature">
          <h2>🛡️ Report Breaches</h2>
          <p>
            Quickly create detailed records of incidents, breaches, or security
            events within your organization.
          </p>
        </div>
        <div className="feature">
          <h2>📊 Visualize and Audit</h2>
          <p>
            Track incident patterns, detect vulnerabilities, and build a
            resilient response plan.
          </p>
        </div>
        <div className="feature">
          <h2>🔒 Built with Security in Mind</h2>
          <p>
            Data is protected with encryption and access controls that follow
            industry best practices.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} AUSDIAS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
