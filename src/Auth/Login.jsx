import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Attempting login with:", { email, password });

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      console.log("Response from server:", response.data);

      if (response.data.message === "Login successful") {
        localStorage.setItem("token", response.data.token);
        navigate("/update-password");
      } else {
        alert("Login failed, check your credentials.");
      }
    } catch (error) {
      console.error("Login error", error);
      if (error.response && error.response.data) {
        alert(
          error.response.data.message || "An error occurred while logging in."
        );
      } else {
        alert("An error occurred while logging in.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
