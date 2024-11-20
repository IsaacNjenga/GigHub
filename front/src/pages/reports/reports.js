import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import axios from "axios";
import { UserContext } from "../../App";

function Reports() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get("fetchReports", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const reports = res.data.reports;
          setData(reports);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchReports();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Link to="/create-report">Create Report</Link>
      <div>
        <h1>Reports</h1>
        <div>
          {data.map((report) => (
            <div key={report._id}>
              <p>{report.subject}</p>
              <p>{report.username}</p>
              <p>{report.email}</p>
              <p>{report.mobile}</p>
              <p>{report.complaint}</p>
              <button className="update-profile-btn">
                <Link to={`/update-report/${report._id}`}>Edit</Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Reports;
