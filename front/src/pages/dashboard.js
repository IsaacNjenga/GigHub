import React from "react";
import Navbar from "../components/navbar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div>
        <h1>Dashboard</h1>
      <button>Post a Gig</button><button>Post a Project</button>
      </div>
    </>
  );
}

export default Dashboard;
