import React, { useState } from "react";
export default function Login({onLoginSuccess}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email: ", email);
    console.log("Password: ", password);
    //static credetials validation check
    if(email === "rakesh@gmail.com" && password ==="123")
    {
        onLoginSuccess(); //updating login status by calling parent function
    }
    else
    {
        setError("Invalid email or username");
        setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
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
