import React, { useContext, useState } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import { UserContext } from "../../App";

function CreateGig() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value || e.target.id });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const valuesData = { ...values, username: user.username };
    axios
      .post("createGig", valuesData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success("Gig Posted Successfully", {
            position: "top-right",
            autoClose: 800,
          });
          navigate("/gigs");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error", error);
        toast.error("Error posting Gig", {
          position: "top-right",
          autoClose: 800,
        });
      });
  };

  const back = (e) => {
    e.preventDefault();
    navigate("/gigs");
  };

  const jobTypes = [
    "Full-Time",
    "Part-Time",
    "Freelance",
    "Contract Employment",
    "Internship",
  ];

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div>
        <h1>Gigs</h1>
        <form className="gig-form" onSubmit={handleSubmit}>
          <div>
            <label>Job Title</label>
            <input type="text" onChange={handleChange} name="title" />
            <label>Summary</label>
            <textarea onChange={handleChange} name="summary" />
            <label>Type</label>
            <select name="type" onChange={handleChange} className="type-select">
              <option value="">Select Type</option>
              {jobTypes.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <label>Responsibilities</label>{" "}
            <textarea onChange={handleChange} name="responsibilities" />
            <label>Requirements</label>{" "}
            <textarea onChange={handleChange} name="requirements" />
            <label>Work Environment</label>{" "}
            <textarea onChange={handleChange} name="environment" />
            <label>Compensation & Benefits</label>{" "}
            <textarea onChange={handleChange} name="benefits" />
            <div>
              <label>Location</label>
              <br />
              <input
                type="radio"
                onChange={handleChange}
                name="location"
                id="on-site"
                value="On-site"
                checked={values.location === "On-site"}
                className="form-radio"
              />
              <label>On-Site</label>
              <input
                type="radio"
                onChange={handleChange}
                name="location"
                id="remote"
                value="Remote"
                checked={values.location === "Remote"}
                className="form-radio"
              />
              <label>Remote</label>
            </div>
            <label>Organisation & Company</label>{" "}
            <input type="text" onChange={handleChange} name="organisation" />
            <label>How to Apply</label>{" "}
            <textarea onChange={handleChange} name="apply" />
            <label>Additional Information</label>{" "}
            <textarea onChange={handleChange} name="info" />
          </div>
          <button type="submit">Post Gig</button>
          <button onClick={back}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default CreateGig;
