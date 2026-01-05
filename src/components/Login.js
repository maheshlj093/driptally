import { useState } from "react";
import { url } from "./url";
import logo from "../logo.png";

export default function Login({ onLogin }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!mobile || !password) return setError("Enter credentials");

    setLoading(true);

    fetch(url.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === "success") {
          localStorage.setItem("admin_logged_in", "1");
          localStorage.setItem("admin_id", data.admin_id);
          onLogin();
        } else {
           setError(data.message || "Invalid login credentials");
        }
      });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
        <div className="container-fluid">
         <span className="navbar-brand d-flex align-items-center fw-bold">
          <img
            src={logo}
            alt="Drip Messaging"
            height="32"
            className="me-2"
          />
          Drip Tally
        </span>
        </div>
      </nav>

      {/* Login Card */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div className="card shadow border-0 rounded-4" style={{ width: "380px" }}>
          <div className="card-body p-4">
            <h5 className="text-center mb-4 fw-bold">Admin Login</h5>

            <input
              className="form-control mb-3"
              placeholder="Mobile Number"
              onChange={e => {setMobile(e.target.value);setError("")}}
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
              onChange={e => {setPassword(e.target.value);setError("")}}
            />

            <button
              className="btn btn-success w-100"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <p
              style={{
                minHeight: "24px",   // reserve space ALWAYS
                color: "red",
                margin: 0,textAlign: "center",
              }}
            >
              {error}
            </p>


          </div>
        </div>
      </div>
    </>
  );
}
