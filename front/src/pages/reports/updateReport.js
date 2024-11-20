import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

function UpdateReport() {
  const { user } = useContext(UserContext);
  const [values, setValues] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchReport/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const report = res.data.report[0];
          setData((prevData) => ({ ...prevData, ...report }));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchReport();
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const valuesData = { ...values };
    console.log(valuesData);
    await axios
      .post("createReport", valuesData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success("Report Submitted Successfully", {
            position: "top-right",
            autoClose: 800,
          });
          navigate("/reports");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error("Error submitting report", {
          position: "top-right",
          autoClose: 800,
        });
      });
  };
  const navigate = useNavigate();
  const back = () => {
    navigate("/reports");
  };
  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <button onClick={back} className="back-btn">
        Back
      </button>
      <div>
        <h1>Complaint Report</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <h2>Complaint details</h2>
            <label>Raised by:</label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              className="input"
            />
            <label>E-mail: </label>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="input"
            />
            <label>Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
              className="input"
            />
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={data.subject}
              onChange={handleChange}
              className="input"
            />
            <div>
              <h2>The complaint</h2>
              <textarea
                type="text"
                name="complaint"
                value={data.complaint}
                onChange={handleChange}
                className="input"
              />
            </div>{" "}
            <button type="submit">Submit complaint</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateReport;
