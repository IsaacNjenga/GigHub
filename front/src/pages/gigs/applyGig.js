import React, { useCallback, useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Loader from "../../components/loader";
import "../../assets/css/gigsCss/applyGig.css";
import { format } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function ApplyGig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState([]);
  const [fetchedGig, setFetchedGig] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [contractorId, setContractorId] = useState("");

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const profileDetails = response.data.profile.find(
        (profile) => profile.postedBy === user._id
      );
      setProfileData({
        firstname: profileDetails.firstname,
        lastname: profileDetails.lastname,
        username: profileDetails.username,
        role: profileDetails.role,
        email: profileDetails.email,
        phone: profileDetails.phone,
        expertise: profileDetails.expertise,
        profileImage: profileDetails.profileImage,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  const fetchGig = useCallback(async () => {
    setLoading(true);
    try {
      axios
        .get(`fetchGigs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          const gig = result.data.gigs;
          const gigFetched = gig.find((job) => job._id === id);
          setContractorId(gigFetched.postedBy);
          setFetchedGig(gigFetched);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      alert("An error occurred. Try refreshing the page");
      console.log("Error", error);
    }
  });

  useEffect(() => {
    if (user) {
      fetchGig();
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

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
    const profileInformation = {
      ...profileData,
      jobId: id,
      contractorId: contractorId,
    };
    const valuesData = { ...values, ...profileInformation };
    console.log(profileInformation);
    const formData = new FormData();
    formData.append("file", file);
    for (const key in valuesData) {
      if (valuesData.hasOwnProperty(key)) {
        formData.append(key, valuesData[key]);
      }
    }

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
        (applicant) => applicant.postedBy === user._id && applicant.jobId === id
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

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure you want to withdraw your application?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`deleteApplication/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              const fetchedApplications = res.data.applicants.filter(
                (applicant) =>
                  applicant.postedBy === user._id && applicant.jobId === id
              );
              setData(fetchedApplications);
              MySwal.fire({
                title: "Deleted!",
                text: "Deleted Successfully",
                icon: "success",
              });
            });
        }
      })
      .catch((err) => {
        MySwal.fire({
          title: "Error!",
          text: "An error occured",
          icon: "error",
        });
        console.log(err);
      });
  };

  const messageContractor = (e) => {
    e.preventDefault();
    navigate("/chats");
  };

  const back = (e) => {
    e.preventDefault();
    navigate("/gigs");
  };

  // Helper function to create a download link for binary data
  const createOpenLink = (filePath, file) => {
    const url = `http://localhost:3001${filePath}`; // Change to production URL in deployment
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        Open {file}
      </a>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className="application-background">
        <Navbar />
        <div>
          <h1>Application</h1>
          <button onClick={back} className="back-btn">
            Back
          </button>
          <div className="application-container">
            <div className="gig-div">
              {fetchedGig && (
                <div>
                  <h3 className="gig-description">
                    <strong>Title:</strong> {fetchedGig.title}
                  </h3>
                  {fetchedGig.createdAt && (
                    <p className="gig-info">
                      <strong>Posted on: </strong>
                      {format(
                        new Date(fetchedGig.createdAt),
                        "EEEE do, MM yyyy"
                      )}
                    </p>
                  )}
                  <p className="gig-info">
                    <strong>Contractor:</strong>{" "}
                    {fetchedGig.username
                      ? fetchedGig.username.replace(
                          /^./,
                          fetchedGig.username[0].toUpperCase()
                        )
                      : fetchedGig.username}
                  </p>
                  <p className="gig-info">
                    <strong>Type:</strong> {fetchedGig.type}
                  </p>
                  <p className="gig-info">
                    <strong>Location:</strong> {fetchedGig.location}
                  </p>
                  <div className="gig-info">
                    <strong>Work Environment:</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.environment,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Organisation & Company:</strong>{" "}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.organisation,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Requirements:</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.requirements,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Responsibilities:</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.responsibilities,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Job Summary:</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.summary,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Additional Info:</strong>
                    <div
                      dangerouslySetInnerHTML={{ __html: fetchedGig.info }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>Work Benefits & Compensation:</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fetchedGig.benefits,
                      }}
                    />
                  </div>
                  <div className="gig-info">
                    <strong>How To Apply:</strong>
                    <div
                      dangerouslySetInnerHTML={{ __html: fetchedGig.apply }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="application-div">
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
                <br />
                <div className="application-button-container">
                  <button
                    type="submit"
                    style={
                      data.length > 0
                        ? { backgroundColor: "grey", cursor: "not-allowed" }
                        : {}
                    }
                    className="submit-application-btn"
                    disabled={data.length > 0}
                  >
                    Submit
                  </button>
                </div>
              </form>
              <button className="delete-application-btn" onClick={handleDelete}>
                Withdraw application
              </button>
              {data.length > 0 ? (
                <div>
                  <div>
                    <p style={{ color: "green" }}>
                      Application submitted. The contractor will be notified.
                    </p>
                  </div>
                  {/*data.map((applicant, index) => (
                    <div key={index}>
                      <p>Resume: {applicant.filename}</p>
                      {createDownloadLink(
                        applicant.name,
                        applicant.filePath,
                      )}
                    </div>
                      ))*/}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyGig;
