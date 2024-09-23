import React, { useCallback, useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Loader from "../../components/loader";

function ApplyGig() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState([]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFile(e.target.files[0]); // Store the selected file
    } else {
      setValues({ ...values, [e.target.name]: e.target.value || e.target.id });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("otherField", values.otherField);

    try {
      const res = await axios.post("/apply", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLoading(false);
      if (res.data.success) {
        toast.success("Application Successful", {
          position: "top-right",
          autoClose: 800,
        });
        navigate("/gigs");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error", error);
      toast.error("Error posting Gig", {
        position: "top-right",
        autoClose: 800,
      });
    }
  };

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/applicants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetchedApplications = response.data.applicants.filter(
        (applicant) => applicant.postedBy === user._id
      );
      setData(fetchedApplications);
    } catch (error) {
      console.error("Error fetching:", error);
      toast.error("Error fetching data", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchApplicants();
    }
  }, [user, fetchApplicants]);

  const messageContractor = (e) => {
    e.preventDefault();
  };

  const back = (e) => {
    e.preventDefault();
    navigate("/gigs");
  };

  // Helper function to create a download link for binary data
  const createDownloadLink = (buffer, filename, contentType) => {
    const blob = new Blob([buffer], { type: contentType });
    const url = URL.createObjectURL(blob);
    return (
      <a href={url} download={filename}>
        Download {filename}
      </a>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div>
        <h1>Application</h1>
        <button onClick={back}>Back</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Attach Résumé/Cover Letter</label>
            <input
              type="file"
              name="resume"
              accept=".pdf, .doc, .docx"
              onChange={handleChange}
            />
          </div>
          <div>
            Message Contractor:{" "}
            <button onClick={messageContractor}>Message</button>
          </div>
          <div>
            <button type="submit">Submit</button>{" "}
          </div>
        </form>
        {data.length > 0 ? (
          <div>
            {data.map((applicant, index) => (
              <div key={index}>
                <p>Resume: {applicant.filename}</p>
                {createDownloadLink(
                  applicant.data,
                  applicant.filename,
                  applicant.contentType
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ApplyGig;
