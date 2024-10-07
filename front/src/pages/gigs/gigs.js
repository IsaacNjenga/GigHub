import React, { useCallback, useContext, useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { UserContext } from "../../App";
import { format } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../assets/css/gigsCss/gigs.css";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import ChatContainer from "../../components/chats/chatContainer";
import DOMPurify from "dompurify";

const MySwal = withReactContent(Swal);
function GigList() {
  const { user } = useContext(UserContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("fetchGigs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetchedGigs = response.data.gigs;
      const sanitizedGigs = fetchedGigs.map((gig) => ({
        ...gig,
        summary: DOMPurify.sanitize(gig.summary),
      }));
      setGigs(sanitizedGigs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching:", error);
      toast.error("Error fetching data", { position: "top-right" });
    }
  });

  useEffect(() => {
    if (user) {
      fetchGigs();
    }
  }, [user]);

  const viewGig = (id) => {
    setLoading(true);
    try {
      axios
        .get(`fetchGigs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          const gig = result.data.gigs;
          const fetchedGig = gig.find((job) => job._id === id);
          setSelectedGig(fetchedGig);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      alert("An error occurred. Try refreshing the page");
      console.log("Error", error);
    }
  };

  const viewProfile = (id) => {
    setLoading(true);
    try {
      axios
        .get("fetchProfile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          const profile = result.data.profile;
          const fetchedProfile = profile.find((user) => user.postedBy === id);
          setSelectedProfile(fetchedProfile);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      alert("An error occurred. Try refreshing the page");
      console.log("Error", error);
    }
  };

  const viewMessage = (id) => {};

  const closeGigModal = () => {
    setSelectedGig(null);
  };

  const closeProfileModal = () => {
    setSelectedProfile(null);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  const deleteGig = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this?",
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
            .delete(`deleteGig/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              setGigs(res.data.gigs);
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

  const columns = [
    {
      name: "Contractor",
      selector: (row) => (
        <>
          <p
            onClick={() => viewProfile(row.postedBy)}
            style={{ cursor: "pointer" }}
          >
            {row.username.replace(/^./, row.username[0].toUpperCase())}
          </p>
        </>
      ),
    },
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Location",
      selector: (row) => row.location,
    },
    {
      name: "Organisation",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: row.organisation }} />
      ),
    },
    {
      name: "Message",
      selector: (row) => (
        <>
          <p
            onClick={() => viewMessage(row.postedBy)}
            style={{ cursor: "pointer" }}
          >
            Message
          </p>
        </>
      ),
    },
    {
      name: "More",
      selector: (row) => (
        <>
          <p onClick={() => viewGig(row._id)} style={{ cursor: "pointer" }}>
            View Details
          </p>
        </>
      ),
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          {row.postedBy === user._id ? (
            <div>
              <button>
                <Link to={`/update-gig/${row._id}`}>Update</Link>
              </button>
              <button
                onClick={() => deleteGig(row._id)}
                style={{ cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          ) : (
            <button>
              <Link to={`/apply-gig/${row._id}`}>Apply</Link>
            </button>
          )}
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: 15 + "px",
        fontWeight: 600,
        border: "1px solid #ddd",
        textAlign: "center",
      },
    },
    cells: {
      style: {
        fontSize: 13 + "px",
        fontWeight: 400,
        backgroundColor: "#f2f2f2",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    rows: {
      style: {
        backgroundColor: "#f7f7f7",
        "&:nth-of-type(odd)": {
          backgroundColor: "#ffffff",
        },
        minHeight: "45px",
      },
    },
  };

  return (
    <>
      {loading && <Loader />}
      <div className="gig-background">
        <Navbar />
        <div className="gig-container">
          <h1>Gigs List</h1>
          <Link to="/create-gig" className="post-gig">
            Post a Gig
          </Link>
          <p>Gigs Available:</p>
          <div className="gigs-list">
            <DataTable
              columns={columns}
              data={gigs}
              customStyles={customStyles}
              pagination
            />
          </div>
          {selectedMessage && (
            <div className="chat-modal-overlay" onClick={closeMessageModal}>
              <div
                className="chat-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={closeMessageModal}>
                  &times;
                </button>
                <h1 className="chat-modal-title">Receiver's name and pfp</h1>
                <hr cols="3" /> <br />
                <div className="chat-modal-body">
                  <div className="chat-body">
                    <ChatContainer />
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedProfile && (
            <div className="profile-modal-overlay" onClick={closeProfileModal}>
              <div
                className="profile-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={closeProfileModal}>
                  &times;
                </button>
                <div
                  className="background-profile"
                  style={{
                    backgroundImage: `url(${selectedProfile.profileImage})`,
                  }}
                >
                  <div className="container-profile">
                    <h1 className="profile-modal-title">Username</h1>
                    <div className="profile-modal-body">
                      <div className="profile-details">
                        <img
                          src={selectedProfile.profileImage}
                          alt="pfp"
                          className="profile-pfp"
                        />
                        <div className="profile-body">
                          <p>
                            {selectedProfile.firstname}{" "}
                            {selectedProfile.lastname}
                          </p>
                          <p>E-mail: {selectedProfile.email}</p>
                          <p>Expertise: {selectedProfile.expertise}</p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: selectedProfile.bio,
                            }}
                          />
                        </div>
                        <div className="button-container">
                          <button>View more</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedGig && (
            <div className="modal-overlay" onClick={closeGigModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <button
                  className="close-btn"
                  onClick={closeGigModal}
                  aria-label="Close Modal"
                >
                  &times;
                </button>
                <h1 className="modal-title">Gig Details</h1>
                <div className="modal-body">
                  <div className="gig-details">
                    <h3 className="gig-description">
                      <strong>Title:</strong> {selectedGig.title}
                    </h3>
                    {selectedGig.createdAt && (
                      <p className="gig-info">
                        <strong>Posted on: </strong>
                        {format(
                          new Date(selectedGig.createdAt),
                          "EEEE do, MM yyyy"
                        )}
                      </p>
                    )}
                    <p className="gig-info">
                      <strong>Contractor:</strong>{" "}
                      {selectedGig.username.replace(
                        /^./,
                        selectedGig.username[0].toUpperCase()
                      )}
                    </p>
                    <p className="gig-info">
                      <strong>Type:</strong> {selectedGig.type}
                    </p>
                    <p className="gig-info">
                      <strong>Location:</strong> {selectedGig.location}
                    </p>
                    <div className="gig-info">
                      <strong>Work Environment:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.environment,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Organisation & Company:</strong>{" "}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.organisation,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Requirements:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.requirements,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Responsibilities:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.responsibilities,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Job Summary:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.summary,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Additional Info:</strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedGig.info }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>Work Benefits & Compensation:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.benefits,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>How To Apply:</strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedGig.apply }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GigList;
