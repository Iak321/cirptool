import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchIncidents = ({ onSelect, selectedIncidents = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length < 2) {
        setIncidents([]);
        return;
      }

      setLoading(true);

      axios
        .get(`api/search-cve/?q=${encodeURIComponent(searchQuery)}`)
        .then((response) => {
          const data = Array.isArray(response.data) ? response.data : [];
          setIncidents(data);
        })
        .catch((err) => {
          console.error("Search failed", err);
          setIncidents([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Filter out incidents already selected by user
  const filteredIncidents = incidents.filter((incident) => {
    const key = incident.cve_id || incident.id || incident.title;
    return !selectedIncidents.some(
      (sel) => (sel.cve_id || sel.id || sel.title) === key
    );
  });

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search CVE related to the incident..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading && <div className="loading">Searching...</div>}

      {filteredIncidents.length > 0 && (
        <ul className="results-list">
          {filteredIncidents.map((incident, index) => (
            <li
              key={incident.cve_id || incident.id || index}
              onClick={() => onSelect(incident)}
              className="result-item"
              style={{ cursor: "pointer" }}
            >
              <strong>{incident.title || incident.cve_id}</strong>
              <p>
                {incident.description
                  ? incident.description.slice(0, 100)
                  : "No description"}
                ...
              </p>
            </li>
          ))}
        </ul>
      )}

      {selectedIncidents.length > 0 && (
        <div className="selected-incidents-info">
          <small>Selected incidents are hidden from the search results.</small>
        </div>
      )}
    </div>
  );
};

export default SearchIncidents;
