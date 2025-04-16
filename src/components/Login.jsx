import React, { useState } from "react";
import './Login.css';
import companyImage from '../assets/image.png'; // Ensure this path is correct

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "rakesh@gmail.com" && password === "123") {
      onLoginSuccess();
    } else {
      setError("Invalid email or username");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div
          className="login-image"
          style={{ backgroundImage: `url(${companyImage})` }}
        ></div>
        <div className="login-form-section">
          <h5 className="login-title">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Submit
            </button>
            {error && <div className="alert alert-danger">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
