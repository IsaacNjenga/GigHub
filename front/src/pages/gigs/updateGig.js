import React, { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Loader from "../../components/loader";
import "../../assets/css/gigsCss/updateGig.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function UpdateGig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});
  const [data, setData] = useState(false);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("fetchGigs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.gigs) {
        setData(true);
        const fetchedGig = response.data.gigs.find((gig) => gig._id === id);
        setValues((prevValues) => ({ ...prevValues, ...fetchedGig }));
        console.log(values);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching:", error);
      toast.error("Error fetching data", { position: "top-right" });
    }
  }, [user, id]);

  useEffect(() => {
    if (user) {
      fetchGigs();
    }
  }, [user, fetchGigs]);

  const handleChange = (e, content = null, fieldName = null) => {
    if (content !== null && fieldName !== null) {
      // Only update the state if the content has changed
      if (values[fieldName] !== content) {
        setValues({
          ...values,
          [fieldName]: content,
        });
      }
    } else {
      // Update state only if input value has changed
      if (values[e.target.name] !== e.target.value) {
        setValues({
          ...values,
          [e.target.name]: e.target.value,
        });
      }
    }
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

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  return (
    <>
      {loading && <Loader />}{" "}
      <div className="update-gig-background">
        <Navbar />
        <div className="update-gig-container">
          <h1>Edit gig</h1> <hr />
          <br />
          {data ? (
            <div className="create-gig-form">
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="input"
                    onChange={handleChange}
                    name="title"
                    value={values.title}
                  />
                  <label>Summary</label>
                  <ReactQuill
                    value={values.summary || ""}
                    onChange={(content) =>
                      handleChange(null, content, "summary")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
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
                  </select>{" "}
                  <br />
                  <br />
                  <hr />
                  <label>Responsibilities</label>{" "}
                  <ReactQuill
                    value={values.responsibilities || ""}
                    onChange={(content) =>
                      handleChange(null, content, "responsibilities")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <label>Requirements</label>{" "}
                  <ReactQuill
                    value={values.requirements || ""}
                    onChange={(content) =>
                      handleChange(null, content, "requirements")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <label>Work Environment</label>{" "}
                  <ReactQuill
                    value={values.environment || ""}
                    onChange={(content) =>
                      handleChange(null, content, "environment")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <label>Compensation & Benefits</label>{" "}
                  <ReactQuill
                    value={values.benefits || ""}
                    onChange={(content) =>
                      handleChange(null, content, "benefits")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <br />
                  <br />
                  <div className="radio-input">
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
                  <br />
                  <hr />
                  <label>Organisation & Company</label>{" "}
                  <ReactQuill
                    value={values.organisation || ""}
                    onChange={(content) =>
                      handleChange(null, content, "organisation")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <label>How to Apply</label>{" "}
                  <ReactQuill
                    value={values.apply || ""}
                    onChange={(content) => handleChange(null, content, "apply")}
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                  <label>Additional Information</label>{" "}
                  <ReactQuill
                    value={values.info || ""}
                    onChange={(content) => handleChange(null, content, "info")}
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                </div>
                <div className="button-container">
                  <button type="submit" className="submit-gig-btn">
                    Update Gig
                  </button>
                  <button onClick={back} className="cancel-gig-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateGig;
