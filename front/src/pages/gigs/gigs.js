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
import { faGrip, faList, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import CustomMoment from "../../components/customMoment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ReverseGeocode from "../../components/reverseGeocode";

const MySwal = withReactContent(Swal);
function GigList() {
  const { user } = useContext(UserContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showContractorGigs, setShowContractorGigs] = useState(false);
  const [showAllGigs, setShowAllGigs] = useState(true);
  const [myGigs, setMyGigs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [grid, setGrid] = useState(false);
  const [list, setList] = useState(true);
  const [mapCoordinates, setMapCoordinates] = useState({
    lat: null,
    lng: null,
  });

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
      const contractorGigs = fetchedGigs.filter(
        (contractorGig) => contractorGig.postedBy === user._id
      );
      setMyGigs(contractorGigs);
      setGigs(sanitizedGigs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching:", error);
      toast.error("Error fetching gigs", { position: "top-right" });
    }
  });

  // const fetchAppliedGigs = useCallback(
  //   async (id) => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.get(`applicants`, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       });
  //       if (res.data.success) {
  //         setLoading(false);
  //         const applications = res.data.applicants;
  //         const appliedGigs = applications.filter(
  //           (application) => application.jobId === id
  //         );
  //         console.log(appliedGigs);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       console.error("Error fetching:", error);
  //       toast.error("Error fetching gigs", { position: "top-right" });
  //     }
  //   },
  //   [user]
  // );

  useEffect(() => {
    if (user) {
      fetchGigs();
      //fetchAppliedGigs();
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

  const viewApplications = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`applicants`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setLoading(false);
        const applications = res.data.applicants;
        const appliedGigs = applications.filter(
          (application) => application.jobId === id
        );
        setSelectedApplication(true);
        setApplications(appliedGigs);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching:", error);
      toast.error("Error fetching applications", { position: "top-right" });
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

  const closeGigModal = () => {
    setSelectedGig(null);
  };
  const closeProfileModal = () => {
    setSelectedProfile(null);
  };

  const closeApplicationModal = () => {
    setSelectedApplication(null);
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

  const showGigs = () => {
    setShowContractorGigs(false);
    setShowAllGigs(true);
  };

  const showMyGigs = () => {
    setShowContractorGigs(true);
    setShowAllGigs(false);
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
      name: "mode",
      selector: (row) => row.location,
      grow: 0,
    },
    {
      name: "Posted",
      selector: (row) => (
        <CustomMoment
          postedTime={row.createdAt ? row.createdAt : row.updatedAt}
        />
      ),
      grow: 0,
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div className="view-gig-container">
            {row.postedBy === user._id ? (
              <>
                <button
                  onClick={() => viewGig(row._id)}
                  style={{ cursor: "pointer" }}
                  className="view-gig-btn"
                >
                  View Details
                </button>
                <button
                  onClick={() => viewApplications(row._id)}
                  style={{ cursor: "pointer" }}
                  className="view-app-btn"
                >
                  View Applications
                </button>
              </>
            ) : (
              <button
                onClick={() => viewGig(row._id)}
                style={{ cursor: "pointer" }}
                className="view-gig-btn"
              >
                View Details
              </button>
            )}{" "}
          </div>
        </>
      ),
    },
    // {
    //   name: "id",
    //   selector: (row) => {
    //     fetchAppliedGigs(row._id);
    //   },
    // },
    {
      name: "",
      selector: (row) => (
        <>
          {row.postedBy === user._id ? (
            <div className="view-gig-container">
              <button className="update-gig-btn">
                <Link
                  to={`/update-gig/${row._id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
              </button>
              <button
                onClick={() => deleteGig(row._id)}
                style={{ cursor: "pointer" }}
                className="delete-gig-btn"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ) : (
            <button className="apply-gig-btn">
              <Link
                to={`/apply-gig/${row._id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Apply
              </Link>
            </button>
          )}
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        borderBottom: "2px solid #5bacba",
        backgroundColor: "#e0e0e0",
        color: "#333",
        textAlign: "center",
        padding: "10px",
        textTransform: "uppercase",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        fontWeight: 500,
        backgroundColor: "#f7f7f7", // Softer, light background
        color: "#333", // Darker text for readability
        padding: "10px", // More padding for cleaner layout
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        alignItems: "center",
      },
    },
    rows: {
      style: {
        backgroundColor: "#fafafa", // Softer white background
        "&:nth-of-type(odd)": {
          backgroundColor: "#ffffff",
        },
        minHeight: "50px", // Slightly taller rows for comfort
        transition: "background-color 0.3s ease", // Smooth hover effect
        "&:hover": {
          backgroundColor: "#f0f8ff", // Light blue hover effect
        },
      },
    },
  };

  // Helper function to create an open link for binary data
  const createOpenLink = (fileId, file) => {
    const token = localStorage.getItem("token");
    const url = `https://gig-hub-liart.vercel.app/gighub/file/${fileId}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.blob();
            })
            .then((blob) => {
              const blobUrl = window.URL.createObjectURL(blob);
              window.open(blobUrl, "_blank");
            })
            .catch((error) => console.error("Error fetching the file:", error));
        }}
      >
        Open {file}
      </a>
    );
  };

  const viewMap = (lat, lng) => {
    if (lat != null && lng != null) {
      setMapCoordinates({ lat, lng });
      setShowMap(true);
    } else {
      console.error("Invalid coordinates for map display:", lat, lng);
    }
  };

  const listView = () => {
    setList(true);
    setGrid(false);
  };

  const gridView = () => {
    setList(false);
    setGrid(true);
  };

  return (
    <>
      {loading && <Loader />}
      {/* <UserProfile /> */}
      <div className="gig-background">
        <Navbar />
        <div className="gig-container">
          <h1>
            <u>Gigs List</u>
          </h1>
          {user.role === "Contractor" ? (
            <Link to="/create-gig" className="post-gig">
              Post a Gig
            </Link>
          ) : null}
          <div>
            <form>
              <InputGroup>
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gig type, location, title"
                  className="gig-search-bar"
                />
              </InputGroup>
            </form>
            <div className="gig-button-container">
              <button className="all-gig-button" onClick={showGigs}>
                All Gigs
              </button>
              {user.role === "Contractor" ? (
                <button className="my-gig-button" onClick={showMyGigs}>
                  My Gigs
                </button>
              ) : null}
              <button className="applied-gig-button">Applied Gigs</button>
            </div>
          </div>
          {search ? (
            <div className="searched">
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Contractor</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Posted</th>
                      <th>More</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tr>
                    <td colSpan="16">
                      <hr />
                    </td>
                  </tr>
                  <tbody>
                    {gigs
                      .filter(
                        (gig) =>
                          search.toLowerCase() === "" ||
                          Object.values(gig).some(
                            (value) =>
                              typeof value === "string" &&
                              value.toLowerCase().includes(search)
                          )
                      )
                      .map((gig) => (
                        <React.Fragment key={gig._id}>
                          <tr>
                            <td>
                              {gig.username.replace(
                                /^./,
                                gig.username[0].toUpperCase()
                              )}
                            </td>
                            <td>{gig.title}</td>
                            <td>{gig.type}</td>
                            <td>{gig.location}</td>
                            <td>
                              <CustomMoment
                                postedTime={
                                  gig.createdAt ? gig.createdAt : gig.updatedAt
                                }
                              />
                            </td>
                            <td>
                              <button
                                onClick={() => viewGig(gig._id)}
                                style={{ cursor: "pointer" }}
                                className="view-gig-btn"
                              >
                                View Details
                              </button>
                            </td>
                            <td>
                              {gig.postedBy === user._id ? (
                                <div>
                                  <button className="update-gig-btn">
                                    <Link
                                      to={`/update-gig/${gig._id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "white",
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </Link>
                                  </button>
                                  <button
                                    onClick={() => deleteGig(gig._id)}
                                    style={{ cursor: "pointer" }}
                                    className="delete-gig-btn"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              ) : (
                                <button className="apply-gig-btn">
                                  <Link
                                    to={`/apply-gig/${gig._id}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "white",
                                    }}
                                  >
                                    Apply
                                  </Link>
                                </button>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="gigs-list">
              <div className="view-button-container">
                <button
                  onClick={listView}
                  style={{ backgroundColor: list ? "grey" : "transparent" }}
                >
                  <FontAwesomeIcon icon={faList} style={{ fontSize: "30px" }} />
                </button>
                <button
                  onClick={gridView}
                  style={{ backgroundColor: grid ? "grey" : "transparent" }}
                >
                  <FontAwesomeIcon icon={faGrip} style={{ fontSize: "30px" }} />
                </button>
              </div>
              {grid && (
                <div className="card-grid">
                  {gigs.map((gig) => (
                    <div key={gig._id} className="gig-card">
                      <div className="card-header">
                        {" "}
                        <h3>{gig.title}</h3>{" "}
                        <span className="time-ago">
                          Posted:{" "}
                          <CustomMoment
                            postedTime={
                              gig.createdAt ? gig.createdAt : gig.updatedAt
                            }
                          />
                        </span>
                      </div>
                      <hr />
                      <p>
                        <strong>Contractor:</strong>{" "}
                        {gig.username.replace(
                          /^./,
                          gig.username[0].toUpperCase()
                        )}
                      </p>{" "}
                      <p>
                        <strong>Type:</strong> {gig.type}
                      </p>
                      <p>
                        <strong>Mode:</strong> {gig.location}
                      </p>
                      <br />
                      <hr />
                      <div className="card-button-container">
                        {gig.postedBy === user._id ? (
                          <>
                            <button
                              onClick={() => viewGig(gig._id)}
                              style={{ cursor: "pointer" }}
                              className="card-view-gig-btn"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => viewApplications(gig._id)}
                              style={{ cursor: "pointer" }}
                              className="card-view-app-btn"
                            >
                              View Applications
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => viewGig(gig._id)}
                              style={{ cursor: "pointer" }}
                              className="card-view-gig-btn"
                            >
                              View Details
                            </button>
                            <button className="card-apply-gig-btn">
                              <Link
                                to={`/apply-gig/${gig._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "white",
                                }}
                              >
                                Apply
                              </Link>
                            </button>
                          </>
                        )}{" "}
                      </div>
                      <br />
                      <div>
                        {gig.postedBy === user._id ? (
                          <div className="card-action-button-container">
                            <button className="card-update-gig-btn">
                              <Link
                                to={`/update-gig/${gig._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "white",
                                }}
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </Link>
                            </button>
                            <button
                              onClick={() => deleteGig(gig._id)}
                              style={{ cursor: "pointer" }}
                              className="card-delete-gig-btn"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {list && (
                <DataTable
                  columns={columns}
                  data={showAllGigs ? gigs : myGigs}
                  customStyles={customStyles}
                  pagination
                />
              )}
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
                    <h1 className="profile-modal-title">
                      @
                      {selectedProfile.username.replace(
                        /^./,
                        selectedProfile.username[0].toUpperCase()
                      )}
                    </h1>
                    <div className="profile-modal-body">
                      <div className="profile-details">
                        <img
                          src={selectedProfile.profileImage}
                          alt="pfp"
                          className="profile-pfp"
                        />
                        <div className="profile-body">
                          <p style={{ textAlign: "center" }}>
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
                          <button>
                            <Link to={`/user/${selectedProfile.postedBy}`}>
                              View more
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedApplication && (
            <div className="modal-overlay" onClick={closeApplicationModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                {" "}
                <button
                  className="close-btn"
                  onClick={closeGigModal}
                  aria-label="Close Modal"
                >
                  &times;
                </button>{" "}
                <h1 className="modal-title">Applicants' Details</h1>{" "}
                <div className="modal-body">
                  {applications.map((application, index) => (
                    <div key={index}>
                      <div className="chat-info">
                        <img
                          src={application.profileImage}
                          alt="_"
                          className="chat-pfp"
                        />
                        <div className="user-details">
                          <p
                            style={{
                              color: "#666",
                              fontSize: "15px",
                            }}
                          >
                            @{application.username}
                          </p>
                          <p>
                            <strong>
                              <span>
                                {application.firstname} {application.lastname}
                              </span>
                            </strong>
                          </p>
                          <p>{application.role}</p>
                        </div>
                      </div>{" "}
                      <div>
                        Applied:{" "}
                        <CustomMoment postedTime={application.createdAt} />
                      </div>
                      <p>
                        <strong>E-mail:</strong> {application.email}
                      </p>
                      <p>
                        <strong>Phone No.:</strong> {application.phone}
                      </p>
                      <p>
                        <strong>Expertise:</strong> {application.expertise}
                      </p>
                      <p>
                        <strong>Resume:</strong> {application.file}
                      </p>
                      {createOpenLink(application._id, application.file)}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button>Message {application.username}</button>
                      </div>{" "}
                      <br />
                      <hr />
                    </div>
                  ))}
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
                      <strong>{selectedGig.title}</strong>
                    </h3>
                    {selectedGig.createdAt && (
                      <p className="gig-info">
                        <strong>Posted on: </strong>
                        {format(
                          new Date(
                            selectedGig.createdAt
                              ? selectedGig.createdAt
                              : selectedGig.updatedAt
                          ),
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
                      <strong>Location:</strong> {selectedGig.location}{" "}
                      {selectedGig.lat && selectedGig.lng ? (
                        <p
                          style={{ margin: 0 }}
                          className="view-more"
                          onClick={() =>
                            viewMap(selectedGig.lat, selectedGig.lng)
                          }
                        >
                          See on map
                        </p>
                      ) : null}
                    </p>{" "}
                    {showMap && (
                      <p
                        onClick={() => {
                          setShowMap(false);
                        }}
                        style={{
                          cursor: "pointer",
                          margin: 0,
                          fontSize: "20px",
                        }}
                      >
                        &times;
                      </p>
                    )}
                    {showMap &&
                      mapCoordinates.lat != null &&
                      mapCoordinates.lng != null && (
                        <ReverseGeocode
                          lat={mapCoordinates.lat}
                          lng={mapCoordinates.lng}
                        />
                      )}
                    <div className="gig-info">
                      <strong>
                        <u>Work Environment</u>:
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.environment,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Organisation & Company:</u>
                      </strong>{" "}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.organisation,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Requirements:</u>
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.requirements,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Responsibilities</u>:
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.responsibilities,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Job Summary</u>:
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.summary,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Additional Info</u>:
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedGig.info }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>Work Benefits & Compensation</u>:
                      </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedGig.benefits,
                        }}
                      />
                    </div>
                    <div className="gig-info">
                      <strong>
                        <u>How To Apply</u>:
                      </strong>
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
