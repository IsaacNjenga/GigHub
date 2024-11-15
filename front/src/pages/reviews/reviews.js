import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import Loader from "../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/reviewCss/review.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import defaultPfp from "../../assets/images/defaultProfilePic.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const MySwal = withReactContent(Swal);
function Reviews() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [selectedReviewee, setSelectedReviewee] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [averageRate, setAverageRate] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("fetchProfile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setUsers(res.data.profile);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchReviewerProfile = async (review) => {
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
        setReviews((prevReviews) =>
          prevReviews.map((r) => (r._id === review._id ? updatedReview : r))
        );
      }
    } catch (error) {
      console.log("Error fetching reviewer's profile:", error);
    }
  };

  const fetchUserReviews = async (revieweeId) => {
    setLoading(true);
    try {
      const res = await axios.get(`fetchReviews?revieweeId=${revieweeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        const reviewsWithProfiles = res.data.reviews;
        setReviews(reviewsWithProfiles);

        // Fetch the profiles for each review
        reviewsWithProfiles.forEach((review) => fetchReviewerProfile(review));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching reviews:", error);
    }
  };

  const fetchAllReviews = async (revieweeId) => {
    setLoading(true);
    try {
      const res = await axios.get(`fetchReviews?revieweeId=${revieweeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        const reviewsWithProfiles = res.data.reviews;
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
        });
        let averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
        setAverageRate(averageRating);
        setTotalRating(ratingCount);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching user:", error);
    }
  };

  // useEffect(() => {
  //   fetchAllReviews(user._id);
  // }, []);

  const handleUserClick = (user) => {
    setSelectedReviewee(user);
    fetchUserReviews(user.postedBy);
    fetchAllReviews(user.postedBy);
  };

  const deleteReview = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this review?",
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
            .delete(`deleteReview?id=${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              //setGigs(res.data.gigs);
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
      if (i <= rating) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            style={{ color: "yellow", fontSize: "35px" }}
          />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            style={{ color: "yellow", fontSize: "35px" }}
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faRegularStar}
            style={{ color: "yellow", fontSize: "35px" }}
          />
        );
      }
    }
    return stars;
  };

  return (
    <>
      {loading && <Loader />}
      <div className="review-page-background">
        <Navbar />
        <div className="reviews-container">
          <div className="users-div">
            <h2>Users</h2>
            <form>
              <InputGroup>
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="reviews-search-bar"
                />
              </InputGroup>
            </form>
            <br />
            {search ? (
              <div>
                {users
                  .filter(
                    (user) =>
                      search.toLowerCase() === "" ||
                      Object.values(user).some(
                        (value) =>
                          typeof value === "string" &&
                          value.toLowerCase().includes(search)
                      )
                  )
                  .map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className={`chat-item ${
                        selectedReviewee?._id === user._id ? "active" : ""
                      }`}
                    >
                      <div className="chat-info">
                        <img
                          src={
                            user.profileImage ? user.profileImage : defaultPfp
                          }
                          alt=""
                          className="chat-pfp"
                        />
                        <div className="chat-details">
                          <p className="chat-username">
                            <u>@{user.username}</u>
                          </p>
                          <p className="chat-name">
                            {user.firstname} {user.lastname}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className={`chat-item ${
                      selectedReviewee?._id === user._id ? "active" : ""
                    }`}
                  >
                    <div className="chat-info">
                      <img
                        src={user.profileImage ? user.profileImage : defaultPfp}
                        alt=""
                        className="chat-pfp"
                      />
                      <div className="user-details">
                        <p className="username">@{user.username}</p>
                        <p className="name">
                          {user.firstname} {user.lastname}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <br />
            <br />
          </div>

          <div className="review-div">
            <div className="review-container">
              <div className="review-body">
                {selectedReviewee ? (
                  <div>
                    <div className="review-bar">
                      <Link
                        to={`/add-review/${selectedReviewee.postedBy}`}
                        style={{ fontSize: "17px" }}
                      >
                        <strong>Write a review</strong>
                      </Link>
                      <p style={{ textAlign: "center", fontWeight: "bold" }}>
                        Reviews for {selectedReviewee.firstname} {" "}
                        {selectedReviewee.lastname}
                      </p>
                      {averageRate && totalRating && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {renderAverageStars(averageRate)}{" "}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p style={{ fontSize: "30px", margin: 0 }}>
                              <strong>
                                {(Math.round(averageRate * 100) / 100).toFixed(
                                  1
                                )}
                              </strong>
                            </p>
                          </div>{" "}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p style={{ color: "grey" }}>
                              ({totalRating}{" "}
                              {totalRating === 1 ? "rating" : "ratings"})
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id}>
                          <div className="chat-info">
                            {review.reviewerProfile &&
                            Array.isArray(review.reviewerProfile) &&
                            review.reviewerProfile.length > 0 ? (
                              <>
                                <img
                                  src={review.reviewerProfile[0].profileImage}
                                  alt="_"
                                  className="chat-pfp"
                                />
                                <div className="user-details">
                                  <p
                                    style={{ color: "#666", fontSize: "15px" }}
                                  >
                                    <Link
                                      to={`/user/${review.reviewerProfile[0].postedBy}`}
                                      style={{
                                        color: "#666",
                                        fontSize: "15px",
                                        textDecoration: "none",
                                      }}
                                    >
                                      @{review.reviewerProfile[0].username}
                                    </Link>
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
                          <p
                            dangerouslySetInnerHTML={{ __html: review.review }}
                          />
                          {review.postedBy === user._id ? (
                            <div className="reviews-button-container">
                              <button className="edit-review-btn">
                                <Link
                                  to={`/update-review/${review._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </Link>
                              </button>
                              <button
                                className="delete-review-btn"
                                onClick={() => deleteReview(review._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          ) : null}

                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>
                        No reviews yet for {selectedReviewee.firstname}{" "}
                        {selectedReviewee.lastname}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Select a user to see their reviews.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reviews;
