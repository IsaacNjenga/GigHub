import React, { useContext, useState } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import { UserContext } from "../../App";
import "../../assets/css/gigsCss/createGigs.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateGig() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, content = null, fieldName = null) => {
    if (content !== null && fieldName !== null) {
      setValues({
        ...values,
        [fieldName]: content,
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const valuesData = {
      ...values,
      username: user.username,
    };
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

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  return (
    <>
      {loading && <Loader />}
      <div className="create-gig-background">
        <Navbar />
        <div className="create-gig-container">
          <h1>Post a Gig</h1>
          <hr />
          <br />
          <div className="create-gig-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="title"
                  className="input"
                />
                <br />
                <label>Summary</label>
                <ReactQuill
                  value={values.summary || ""}
                  onChange={(content) => handleChange(null, content, "summary")}
                  theme="snow"
                  modules={{
                    toolbar: toolbarOptions,
                  }}
                /><br/>
                <label>Type</label>
                <select
                  name="type"
                  onChange={handleChange}
                  className="type-select"
                >
                  <option value="">Select Type</option>
                  {jobTypes.map((job) => (
                    <option key={job} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
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
                  Post Gig
                </button>
                <button onClick={back} className="cancel-gig-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGig;
