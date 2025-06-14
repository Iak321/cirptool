import React, { useState, useEffect } from "react";
import "./profile.css";

const Profile = () => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    company: "Loading...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Use the Django REST Framework endpoint for current user
      const response = await fetch("/api/users/current_user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // DRF Token authentication format
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setUserData({
        name: `${data.first_name} ${data.last_name}`.trim() || data.username,
        email: data.email || "Not available",
        company: data.department || "Not available",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load user data. Please try again later.");
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    // Logic for editing the profile image could go here
    setIsEditingImage(!isEditingImage);
    alert("Edit profile picture (Dummy behavior)");
  };

  const handleChangeEmail = (e) => {
    e.preventDefault();
    // Implement email change functionality
    alert("Change Email functionality will be implemented here");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Implement password change functionality
    alert("Change Password functionality will be implemented here");
  };

  if (loading) {
    return <div className="profile-container">Loading user data...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-info">
        <h2>Welcome</h2>
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Department:</strong> {userData.company}
        </p>
        <div className="profile-actions">
          <a href="#change-email" onClick={handleChangeEmail}>
            Change Email
          </a>
          <a href="#change-password" onClick={handleChangePassword}>
            Change Password
          </a>
        </div>
      </div>

      <div className="profile-image-wrapper">
        <div className="profile-image" onClick={handleImageClick}>
          <div className="profile-image-edit">✎</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
