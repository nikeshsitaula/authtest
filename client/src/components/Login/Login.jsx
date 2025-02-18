import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const handleLogin = async () => {
    console.log("client user", user);
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user }),
      credentials: "include", // Ensures cookies are stored in the browser
    });

    if (response.ok) {
      console.log("Login successful! Cookies are set by the server.");
      navigate("/dashboard");
    } else {
      console.error("Login failed!");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
