import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import Loader from "../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import "../../assets/css/reviewCss/review.css";

function Reviews() {
  const [loading, setLoading] = useState(false);
  const [selectedReviewee, setSelectedReviewee] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

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

  const handleUserClick = (user) => {
    setSelectedReviewee(user);
    fetchUserReviews(user.postedBy);
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

  return (
    <>
      {loading && <Loader />}
      <div className="review-page-background">
        <Navbar />
        <div className="reviews-container">
          <div className="users-div">
            <h2>Users</h2>
            <input
              type="text"
              placeholder="Search..."
              className="reviews-search-bar"
            />
            <br />
            <br />
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
                      src={user.profileImage}
                      alt="avatar"
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
          </div>
          <div className="review-div">
            <div className="review-container">
              <div className="review-body">
                {selectedReviewee ? (
                  <div>
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>
                      Reviews for {selectedReviewee.firstname}{" "}
                      {selectedReviewee.lastname}
                    </p>
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
                                  <p>@{review.reviewerProfile[0].username}</p>
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
                              <p>{review.rating}/5</p>
                            </span>
                          </div>
                          <p>{review.review}</p>
                          <div className="reviews-button-container">
                            <button className="edit-review-btn">Edit</button>
                            <button className="delete-review-btn">
                              Delete
                            </button>
                          </div>
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
