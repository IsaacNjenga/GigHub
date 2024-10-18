import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Loader from "../components/loader";
import { UserContext } from "../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

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
          reviewsWithProfiles.forEach((review) => fetchReviewerProfile(review));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching user:", error);
      }
    };
    fetchUserReviews();
  }, [user]);

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
      <Navbar />
      <div>
        <h1>Dashboard</h1>
        {currentUser.map((user) => (
          <div key={user._postedBy}>
            <p>{user.username}</p>
          </div>
        ))}
        <div>
          <p>Ratings & feedback</p>
          {userReviews.map((review) => (
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
              </div>{" "}
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
        <p>Recent Activity</p>
        <p>Jobs applied</p>
        <p>Profile</p>
      </div>
    </>
  );
}

export default Dashboard;
