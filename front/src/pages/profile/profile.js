import React, { useContext, useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import { UserContext } from "../../App";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "../../components/loader";
import "../../assets/css/profileCss/profile.css";
import missingProfile from "../../assets/icons/question.png";

const MySwal = withReactContent(Swal);

function Profile() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(false);
  const [data, setData] = useState([
    {
      firstname: "",
      lastname: "",
      gender: "",
      email: "",
      phone: "",
      dob: "",
      expertise: "",
      bio: "",
      goals: "",
      age: "",
      interests: "",
    },
  ]);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.profile.length === 0) {
        setValues(false);
      } else {
        setValues(true);
      }
      const profileDetails = response.data.profile.find(
        (profile) => profile.postedBy === user._id
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
      });
      if (profileDetails.profileImage) {
        setProfilePicPreview(profileDetails.profileImage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching profile:", error);
      //toast.error("Error fetching profile data", { position: "top-right" });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const deleteProfile = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete your profile?",
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
            .delete(`deleteProfile/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
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

  return (
    <>
      {loading && <Loader />}
      <div className="profile-background">
        <Navbar />
        <div className="user-profile-container">
          {values ? (
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
                      {user.username.replace(
                        /^./,
                        user.username[0].toUpperCase()
                      )}
                    </i>
                    <p>{user.role}</p>
                  </p>{" "}
                  <p className="name">
                    <strong>
                      {data.firstname} {data.lastname}
                    </strong>
                  </p>{" "}
                  <p className="expertise">{data.expertise}</p> <br />
                  <p className="age">Age: {data.age} yrs</p>
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
              <div className="button-container">
                <Link
                  className="update-profile-btn"
                  to={`/update-profile/${user._id}`}
                >
                  Update your profile
                </Link>
                <br />
                <button
                  className="delete-profile-btn"
                  onClick={() => deleteProfile(user._id)}
                >
                  Delete your profile
                </button>
              </div>
            </div>
          ) : (
            <div className="outdated-container">
              <p className="outdated">
                Looks like your profile is not updated...
              </p>
              <div className="icon-and-btn">
                <img
                  src={missingProfile}
                  className="missingIcon"
                  alt="missingIcon"
                />
                <Link className="create-btn" to="/create-profile">
                  Create your profile here
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
