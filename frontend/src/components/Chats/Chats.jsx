import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ticketService, authService } from "../../services/api";
import { MdVideoCall } from "react-icons/md";
import { BiSolidPhoneCall } from "react-icons/bi";
import "./chats.css";

const Chats = () => {
  const { ticketId } = useParams(); // Get the ticketId from the URL
  const navigate = useNavigate();
  const { state } = useLocation(); // To access the ticketTitle passed from ViewTickets
  
  const [messages, setMessages] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState(null);

  const bottomRef = useRef(null); // To scroll to the bottom when a new message is sent or loaded

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        const ticketDetails = await ticketService.getTicketDetails(ticketId);
        setTicket(ticketDetails);

        const chatData = await ticketService.getTicketChats(ticketId);
        console.log('Fetched chat data:', chatData);
        setMessages(chatData); // Set the messages once they are fetched
      } catch (err) {
        console.error("Error loading chat:", err);
        setError("Failed to load chat or you are not authorized.");
        navigate("/not-authorized");
      }
    };

    fetchData();
  }, [ticketId, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom when messages are updated
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      const newMessage = await ticketService.sendTicketChat(ticketId, {
        content: messageInput,
      });

      setMessages((prev) => [...prev, newMessage]); // Add the new message to the message list
      setMessageInput(""); // Clear the input field
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (error) return <div>{error}</div>;
  if (!ticket || !currentUser) return <div>Loading chat...</div>;

  // **Chat allowed for admin and it support code (Turned off for now)**
  //const allowed =
    //currentUser.user_type === "admin" ||
    //currentUser.user_type === "support" ||
    //currentUser.is_staff;

  //if (!allowed) return <div>You do not have permission to access this chat.</div>;
  
  return (
    <div className="messages-container">
      <div className="chat-sidebar">
        <div className="chat-user active">Chat for Ticket #{ticket.id}</div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>{state?.ticketTitle || ticket.title}</h2> {/* Use ticketTitle from state if available */}
          <div className="chat-toolbar">
            <MdVideoCall className="chat-icon" title="Video Call" />
            <BiSolidPhoneCall className="chat-icon" title="Voice Call" />
          </div>
        </div>

        <div className="chat-messages">
          {Array.isArray(messages) && messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${
                msg.sender?.username === currentUser.username ? "user" : "other"
              }`}
            >
              <strong>{msg.sender?.username}:</strong> {msg.content}
            </div>
          ))}
          <div ref={bottomRef}></div> {/* This ensures the chat scrolls to the bottom */}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chats;
