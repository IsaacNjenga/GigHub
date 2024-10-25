import React, { useCallback, useEffect, useState } from "react";
import Navbar from "./navbar";
import Loader from "./loader";
import defaultProfilePic from "../assets/images/defaultProfilePic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [averageRate, setAverageRate] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const userProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const profileDetails = response.data.profile.find(
        (profile) => profile.postedBy === id
      );
      const dob = new Date(profileDetails.dob);
      const ageInMilli = new Date() - dob;
      const age = Math.floor(ageInMilli / (1000 * 60 * 60 * 24 * 365.25));
      setData({
        firstname: profileDetails.firstname,
        lastname: profileDetails.lastname,
        gender: profileDetails.gender,
        email: profileDetails.email,
        phone: profileDetails.phone,
        dob: profileDetails.dob,
        expertise: profileDetails.expertise,
        bio: profileDetails.bio,
        age: age,
        goals: profileDetails.goals,
        interests: profileDetails.interests,
        username: profileDetails.username,
        role: profileDetails.role,
      });
      if (profileDetails.profileImage) {
        setProfilePicPreview(profileDetails.profileImage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching profile:", error);
    }
  }, [id]);

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`fetchReviews?revieweeId=${id}`, {
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

  useEffect(() => {
    if (id) {
      userProfile();
      fetchUserReviews();
    }
  }, [userProfile, id]);

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
      <div className="profile-background">
        <Navbar />
        <div className="user-profile-container">
          <div>
            <h3>User Profile</h3>
            <div className="user-profile">
              <div className="personal-details">
                <div className="profile-picture">
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>
                <hr />
                <p className="username">
                  @
                  <i>
                    {data.username &&
                      data.username.replace(
                        /^./,
                        data.username[0].toUpperCase()
                      )}
                  </i>
                  <p>{data.role}</p>
                </p>{" "}
                <p className="name">
                  <strong>
                    {data.firstname} {data.lastname}
                  </strong>
                </p>{" "}
                <p className="expertise">{data.expertise}</p>{" "}
                {averageRate && totalRating && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {renderAverageStars(averageRate)}
                    <p style={{ color: "grey" }}>{totalRating} ratings</p>
                  </div>
                )}
                <br /> <p className="age">Age: {data.age} yrs</p>
                <p className="phone">Phone: {data.phone}</p>
                <p className="email">Email: {data.email}</p>
              </div>

              <div className="profile-details">
                <div className="profile-bio">
                  <p className="card-title">Bio</p>
                  <hr />
                  <p dangerouslySetInnerHTML={{ __html: data.bio }} />
                </div>{" "}
                <div className="profile-goals">
                  <p className="card-title">Goals</p>
                  <hr />
                  <p dangerouslySetInnerHTML={{ __html: data.goals }} />
                </div>
                <div className="profile-interests">
                  <p className="card-title">Interests</p>
                  <hr />
                  <p dangerouslySetInnerHTML={{ __html: data.interests }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
