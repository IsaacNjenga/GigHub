import React, { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Loader from "../../components/loader";

function UpdateGig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    summary: "",
    type: "",
    responsibilities: "",
    requirements: "",
    environment: "",
    benefits: "",
    location: "",
    organisation: "",
    apply: "",
    info: "",
  });
  const [data, setData] = useState(false);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("fetchGigs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.gigs) {
        setData(true);
        console.log(data);
      }
      const fetchedGig = response.data.gigs.find((gig) => gig._id === id);
      setValues({
        title: fetchedGig.title,
        summary: fetchedGig.summary,
        type: fetchedGig.type,
        responsibilities: fetchedGig.responsibilities,
        requirements: fetchedGig.requirements,
        environment: fetchedGig.environment,
        benefits: fetchedGig.benefits,
        location: fetchedGig.location,
        organisation: fetchedGig.organisation,
        apply: fetchedGig.apply,
        info: fetchedGig.info,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching:", error);
      toast.error("Error fetching data", { position: "top-right" });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchGigs();
    }
  }, [user]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value || e.target.id });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const valuesData = { ...values, username: user.username };
    axios
      .put(`updateGig/${id}`, valuesData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setLoading(false);
        if (result.data.success) {
          toast.success("Gig Updated Successfully", {
            position: "top-right",
            autoClose: 800,
          });
          navigate("/gigs");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error", err);
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
            <textarea
              onChange={handleChange}
              name="title"
              value={values.title}
            />
            <label>Summary</label>
            <textarea
              onChange={handleChange}
              name="summary"
              value={values.summary}
            />
            <label>Type</label>
            <select
              name="type"
              onChange={handleChange}
              className="type-select"
              value={values.type}
            >
              <option value="">Select Type</option>
              {jobTypes.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <label>Responsibilities</label>{" "}
            <textarea
              onChange={handleChange}
              name="responsibilities"
              value={values.responsibilities}
            />
            <label>Requirements</label>{" "}
            <textarea
              onChange={handleChange}
              name="requirements"
              value={values.requirements}
            />
            <label>Work Environment</label>{" "}
            <textarea
              onChange={handleChange}
              name="environment"
              value={values.environment}
            />
            <label>Compensation & Benefits</label>{" "}
            <textarea
              onChange={handleChange}
              name="benefits"
              value={values.benefits}
            />
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
            <input
              type="text"
              onChange={handleChange}
              name="organisation"
              value={values.organisation}
            />
            <label>How to Apply</label>{" "}
            <textarea
              onChange={handleChange}
              name="apply"
              value={values.apply}
            />
            <label>Additional Information</label>{" "}
            <textarea onChange={handleChange} name="info" value={values.info} />
          </div>
          <button type="submit">Update Gig</button>
          <button onClick={back}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default UpdateGig;
