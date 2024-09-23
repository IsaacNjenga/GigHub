import React, { useState, useContext } from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-toastify";
import Loader from "../components/loader";

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
          toast.success(`Welcome ${res.data.user.username}`, {
            position: "top-right",
            autoClose: 900,
          });
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
      <Navbar />
      <div>
        <h1>Login page</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <label>E-mail Address:</label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              onChange={handleChange}
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            {serverErrors.length > 0 &&
              serverErrors.map((error, index) => (
                <p className="error" key={index}>
                  {error.msg}
                </p>
              ))}
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
