// src/services/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Try to return a readable error message
    const data = error.response.data;
    if (typeof data === "string") {
      return data;
    } else if (typeof data === "object") {
      // Flatten the object and stringify it
      return (
        data.detail || // DRF error format
        Object.values(data).flat().join(" ") || // handle field-specific errors
        error.response.statusText
      );
    }
    return error.response.statusText;
  } else if (error.request) {
    return "No response from server";
  } else {
    return error.message || "Unknown error";
  }
};

export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/login/`,
        { username, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/users/logout/`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/current_user/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },
};

export const ticketService = {
  createTicket: async (ticketData) => {
    try {
      const formData = new FormData();
      formData.append("title", ticketData.title);
      formData.append("description", ticketData.description);
      formData.append("severity", ticketData.severity);
      formData.append("start_date", ticketData.timeframe.start);
      if (!ticketData.timeframe.ongoing) {
        formData.append("end_date", ticketData.timeframe.end);
      }
      formData.append("is_ongoing", ticketData.timeframe.ongoing);

      if (ticketData.customCategory) {
        formData.append("custom_category", ticketData.customCategory);
      }

      formData.append("people", ticketData.people);

      if (ticketData.incidents?.length) {
        ticketData.incidents.forEach((incident, index) => {
          formData.append(`incidents[${index}]`, incident.id);
        });
      }

      if (ticketData.files?.length) {
        ticketData.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      }

      const response = await axios.post(
        `${API_URL}/tickets/create_ticket/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  getIncidents: async (searchQuery = "") => {
    try {
      const response = await axios.get(
        `${API_URL}/tickets/incidents/?search=${searchQuery}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  getUserTickets: async () => {
    try {
      const response = await axios.get(`${API_URL}/tickets/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  getTicketDetails: async (ticketId) => {
    try {
      const response = await axios.get(`${API_URL}/tickets/${ticketId}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  updateTicket: async (ticketId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/tickets/${ticketId}/`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  getTicketChats: async (ticketId) => {
    try {
      const response = await axios.get(
        `${API_URL}/chats/messages/?ticket_id=${ticketId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },

  sendTicketChat: async (ticketId, messageData) => {
    try {
      const payload = { ticket: ticketId, content: messageData.content };
      const response = await axios.post(`${API_URL}/chats/messages/`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  },
};
