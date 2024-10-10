import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token"); // Assuming you store the token in local storage

    try {
      const response = await axios.post(
        "http://localhost:5000/api/update-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      if (response.status === 200) {
        alert("Password updated successfully!");
        navigate("/login");
      } else {
        alert("Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password", error);
      alert(
        "Error updating password: " +
          (error.response?.data.message || "Unknown error")
      );
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={handlePasswordUpdate}>
        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
