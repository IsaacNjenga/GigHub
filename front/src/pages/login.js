import React, { useState, useContext } from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-toastify";
import Loader from "../components/loader";
import "../assets/css/loginCss/login.css";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const [values, setValues] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post("login", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          setLoading(false);
          setUser(res.data.user);
          toast.success(
            `Welcome ${res.data.user.username.replace(
              /^./,
              res.data.user.username[0].toUpperCase()
            )}`,
            {
              position: "top-left",
              autoClose: 1000,
            }
          );
          navigate("/");
        } else {
          alert("Incorrect login details. Try again");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.errors) {
          setServerErrors(err.response.data.errors);
          alert("Incorrect login details. Try again");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="login-background">
        <Navbar />
        <div className="login-container">
          <h1>Sign In</h1>
          <hr />
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>E-mail Address:</label>
              <input
                type="email"
                name="email"
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
              {serverErrors.length > 0 &&
                serverErrors.map((error, index) => (
                  <p className="error" key={index}>
                    {error.msg}
                  </p>
                ))}
              <div className="form-footer">
                <p>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
                <button type="submit" className="submit-btn">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
