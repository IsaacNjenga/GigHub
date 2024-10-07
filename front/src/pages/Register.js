import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/loader";
import "../assets/css/registerCss/register.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post("register", values, {
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success("Sign up successful", {
            position: "top-right",
            autoClose: 900,
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.errors) {
          setServerErrors(err.response.data.errors);
        } else {
          console.log("Error", err);
        }
      });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="register-background">
        <Navbar />
        <div className="register-container">
          <h1>Sign Up </h1>
          <hr />
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                className="input"
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="input"
              />
              <label>Role:</label>
              <input
                type="text"
                name="role"
                onChange={handleChange}
                className="input"
              />
              <label>E-mail Address:</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="input"
              />
              {serverErrors.length > 0 &&
                serverErrors.map((error, index) => (
                  <p className="error" key={index}>
                    {error.msg}
                  </p>
                ))}{" "}
              <div className="form-footer">
                <p>
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
                <button type="submit" className="submit-btn">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
