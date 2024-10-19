import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Loader from "../components/loader";
import { UserContext } from "../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import defaultPfp from "../assets/images/defaultProfilePic.png";
import "../assets/css/dashboardCss/dashboard.css";
import { XAxis, YAxis, Tooltip, Rectangle } from "recharts";
import { BarChart, Bar } from "recharts";
import CustomMoment from "../components/customMoment";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState([]);
  const [averageRate, setAverageRate] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [viewReviews, setViewReviews] = useState(false);
  const [gigsApplied, setGigsApplied] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchCurrentUser?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setCurrentUser(res.data.profile);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  const fetchReviewerProfile = async (review) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `reviewerProfile?reviewerId=${review.postedBy}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        // Merge the profile data with the review
        const updatedReview = {
          ...review,
          reviewerProfile: res.data.profileData,
        };
        // Update the reviews state with the merged data
        setUserReviews((prevReviews) =>
          prevReviews.map((r) => (r._id === review._id ? updatedReview : r))
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching reviewer's profile:", error);
    }
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchReviews?revieweeId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const reviewsWithProfiles = res.data.reviews;
          setUserReviews(reviewsWithProfiles);
          const ratingCounts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          };

          let totalRatings = 0;
          let ratingCount = 0;

          reviewsWithProfiles.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
              ratingCounts[review.rating] += 1;
              totalRatings += review.rating++;
              ratingCount++;
            }
            fetchReviewerProfile(review);
          });
          let averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
          setAverageRate(averageRating);
          setTotalRating(ratingCount);
          ratingsChart(ratingCounts);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching user:", error);
      }
    };
    fetchUserReviews();
  }, [user]);

  //bar graph to display ratings at a glance
  const ratingsChart = (ratingCounts) => {
    const transformedReviewsCount = Object.keys(ratingCounts).map((key) => ({
      name: `${key}`,
      count: ratingCounts[key],
    }));
    setReviewsCount(transformedReviewsCount);
  };

  const openReviewsModal = () => {
    setViewReviews(true);
  };

  const closeReviewModal = () => {
    setViewReviews(false);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchUserApplicants?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setLoading(false);
          const applications = res.data.applicants;

          const fetchedApplications = applications.filter(
            (application) => application.postedBy === user._id
          );
          setGigsApplied(fetchedApplications);
          applications.forEach((application) => fetchGig(application));
        }
      } catch (error) {
        setLoading(false);
        console.log("Error fetching gig applied:", error);
      }
    };
    if (user) fetchApplications();
  }, [user]);

  const fetchGig = async (gigsApplied) => {
    setLoading(true);
    try {
      const res = await axios.get(`fetchUserGigs?jobId=${gigsApplied.jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        const fetchedGig = res.data.gig;
        console.log(fetchedGig);
        const updatedGigApplication = {
          ...gigsApplied,
          fetchedGig,
        };
        setGigsApplied((prevGigs) =>
          prevGigs.map((g) =>
            g.jobId === gigsApplied.jobId ? updatedGigApplication : g
          )
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching gig details:", error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStar : faRegularStar}
          style={{ color: "yellow" }}
        />
      );
    }
    return stars;
  };

  const renderAverageStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStar : faRegularStar}
          style={{ color: "yellow", fontSize: "20px" }}
        />
      );
    }
    return stars;
  };

  return (
    <>
      {loading && <Loader />}
      <div className="dashboard-background">
        <Navbar />
        <div className="dashboard-container">
          <div>
            <h1>Dashboard</h1>
            <div>
              {currentUser.map((user) => (
                <div key={user._postedBy} className="chat-info">
                  <img src={user.profileImage} alt="_" className="chat-pfp" />
                  <div className="user-details">
                    <p style={{ color: "#666", fontSize: "15px" }}>
                      @{user.username}
                    </p>
                    <p>
                      <strong>
                        <span>
                          {user.firstname} {user.lastname}
                        </span>
                      </strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h2>Ratings & Reviews</h2>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ flex: 1, paddingRight: "20px" }}>
                <BarChart
                  layout="vertical" //horizontal graph
                  width={500}
                  height={200}
                  data={reviewsCount}
                  margin={{ top: 10, right: 25, left: 80, bottom: 7 }}
                >
                  <YAxis type="category" dataKey="name" width={85} />
                  <XAxis type="number" hide={true} />
                  <Tooltip />

                  <Bar dataKey="count" fill="yellow" barSize={10}>
                    {reviewsCount.map((entry, index) => (
                      <Rectangle
                        key={`bar-${index}`}
                        width={2}
                        height={entry.count}
                        fill="#8884d8"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div style={{ flex: 1 }}>
                {averageRate && totalRating && (
                  <div>
                    <p style={{ fontSize: "70px", margin: 0 }}>
                      <strong>
                        {(Math.round(averageRate * 100) / 100).toFixed(1)}
                      </strong>
                    </p>
                    {renderAverageStars(averageRate)}
                    <p style={{ color: "grey" }}>{totalRating} ratings</p>
                  </div>
                )}
              </div>
            </div>
            <p onClick={openReviewsModal} className="view-more">
              View more
            </p>
            {viewReviews && (
              <div className="reviews-modal-overlay" onClick={closeReviewModal}>
                <div
                  className="reviews-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-btn" onClick={closeReviewModal}>
                    &times;
                  </button>
                  <h1>Reviews</h1>
                  {userReviews.map((review) => (
                    <div key={review._id} className="user-reviews-container">
                      <div className="chat-info">
                        {review.reviewerProfile &&
                        Array.isArray(review.reviewerProfile) &&
                        review.reviewerProfile.length > 0 ? (
                          <>
                            <img
                              src={
                                review.reviewerProfile[0].profileImage
                                  ? review.reviewerProfile[0].profileImage
                                  : defaultPfp
                              }
                              alt="_"
                              className="chat-pfp"
                            />
                            <div className="user-details">
                              <p style={{ color: "#666", fontSize: "15px" }}>
                                @{review.reviewerProfile[0].username}
                              </p>
                              <p>
                                <strong>
                                  <span>
                                    {review.reviewerProfile[0].firstname}{" "}
                                    {review.reviewerProfile[0].lastname}
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </>
                        ) : (
                          <span>Loading...</span>
                        )}
                      </div>
                      <div>
                        <span>
                          {renderStars(review.rating)}{" "}
                          <p>
                            <strong>{review.rating}/5</strong>
                          </p>
                        </span>
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: review.review }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <h2>Recent Activity</h2>
            <div className="grid-container">
              {gigsApplied.map((gigs) => (
                <div key={gigs._id} className="card">
                  <div className="card-header">
                    {gigs.fetchedGig ? (
                      <h2>{gigs.fetchedGig.title}</h2>
                    ) : (
                      <h2>
                        <span>Loading...</span>
                      </h2>
                    )}
                    <span className="time-ago">
                      Applied:{" "}
                      <CustomMoment
                        postedTime={
                          gigs.createdAt ? gigs.createdAt : gigs.updatedAt
                        }
                      />
                    </span>
                  </div>
                  <div className="card-body">
                    {gigs.fetchedGig ? (
                      <>
                        <span style={{ textAlign: "center" }}>
                          <b
                            dangerouslySetInnerHTML={{
                              __html: gigs.fetchedGig.organisation,
                            }}
                          />
                        </span>
                        <p>
                          <strong>Type:</strong> {gigs.fetchedGig.type}
                        </p>
                        <p>
                          <strong>Location:</strong> {gigs.fetchedGig.location}
                        </p>
                        <p>
                          <strong>Posted:</strong>{" "}
                          <CustomMoment
                            postedTime={
                              gigs.fetchedGig.createdAt
                                ? gigs.fetchedGig.createdAt
                                : gigs.fetchedGig.updatedAt
                            }
                          />
                        </p>
                      </>
                    ) : (
                      <span>Loading...</span>
                    )}
                    <p>
                      <strong>Résumé attached:</strong> {gigs.filename}
                    </p>
                  </div>
                  <div className="card-footer">
                    <p className="view-more">View More</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
