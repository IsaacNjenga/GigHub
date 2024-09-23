import React, { useContext, useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import { UserContext } from "../../App";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "../../components/loader";

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
      <Navbar />
      <div>
        {values ? (
          <div>
            <h1>User Profile Page</h1>
            <div>
              {" "}
              <div className="profile-picture">
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <p>
                Username:
                {user.username.replace(/^./, user.username[0].toUpperCase())}
              </p>
              <p>
                {data.firstname} {data.lastname}
              </p>
              <p>{data.gender}</p>
              <p>{data.email}</p>
              <p>{data.phone}</p>
              <p>{data.age} yrs</p>
              <p>{data.expertise}</p>
              <p>{data.bio}</p>
              <p>{data.goals}</p>
              <p>{data.interests}</p>
            </div>
            <div>
              <Link to={`/update-profile/${user._id}`}>
                Update your profile
              </Link>
              <br />
              <button onClick={() => deleteProfile(user._id)}>
                Delete your profile
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Looks like your profile isn't updated</p>
            <Link to="/create-profile">Create your profile here</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
