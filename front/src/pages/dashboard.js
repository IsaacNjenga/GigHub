import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import "../assets/css/dashboardCss/dashboard.css";
import Loader from "../components/loader";
import FreelancerDashboard from "./dashboard/freelancerDashboard";
import ContractorDashboard from "./dashboard/contractorDashboard";

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
    </>
  );
}

export default Dashboard;
