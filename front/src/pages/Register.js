import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/loader";

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
      <Navbar />
      <div>
        <h1>Sign Up page</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
              type="text"
              placeholder="username"
              name="username"
              onChange={handleChange}
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            <label>Role:</label>
            <input
              type="text"
              placeholder="role"
              name="role"
              onChange={handleChange}
            />
            <label>E-mail Address:</label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              onChange={handleChange}
            />
            {serverErrors.length > 0 &&
              serverErrors.map((error, index) => (
                <p className="error" key={index}>
                  {error.msg}
                </p>
              ))}
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
