import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import "../assets/css/dashboardCss/dashboard.css";
import "../assets/css/dashboardCss/newDashboard.css";
import Loader from "../components/loader";
import FreelancerDashboard from "./dashboard/freelancerDashboard";
import ContractorDashboard from "./dashboard/contractorDashboard";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchCurrentUser?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setCurrentUser(res.data.profile);
          console.log(res.data.profile);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  return (
    <>
      {" "}
      {loading && <Loader />}
      {currentUser &&
        currentUser.map((user) => (
          <div key={user._id}>
            {user.role === "Freelancer" ? (
              <FreelancerDashboard />
            ) : (
              <ContractorDashboard userDetails={currentUser} />
            )}
          </div>
        ))}
      {currentUser.length === 0 ? (
        <>
          <div className="new-dashboard-background">
            {" "}
            <Navbar />
            <div className="new-dashboard-container">
              <h3
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Arial",
                  fontSize: "2em",
                }}
              >
                🌟 Welcome! We're thrilled to have you here! 🌟
              </h3>
              <p
                style={{
                  alignItems: "center",
                  color: "whitesmoke",
                }}
              >
                Set up your profile <Link to="/profile">here</Link> and let’s
                get started on your journey!
              </p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Dashboard;
