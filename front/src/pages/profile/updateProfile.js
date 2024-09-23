import React, { useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import axios from "axios";
import Navbar from "../../components/navbar";
import { UserContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";

function UpdateProfile() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [values, setValues] = useState(false);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);
  const [data, setData] = useState({
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
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.profile) {
        setValues(true);
        console.log(values);
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
      toast.error("Error fetching profile data", { position: "top-right" });
    }
  }, [user, values]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value || e.target.id });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Image = await convertFileToBase64(file);
      setImage(base64Image);
      setProfilePicPreview(base64Image);
    } catch (error) {
      console.error("Error converting image file:", error);
      toast.error("Error uploading image file", { position: "top-right" });
    }
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const profileData = { ...data, profileImage: image };
    axios
      .put(`updateProfile/${id}`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {setLoading(false);
        if (res.data.success) 
        {
          toast.success("Profile updated successfully", {
            position: "top-right",
            autoClose: 700,
          });
          navigate("/profile");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error updating profile", {
          position: "top-right",
          autoClose: 700,
        });
        if (err.response.data.errors) {
          setServerErrors(err.response.data.errors);
        }
        console.log(err);
      });
  };

  const back = () => {
    navigate("/profile");
  };
  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div>
        <h1>Update Your Profile</h1>
        {serverErrors.length > 0 &&
          serverErrors.map((error, index) => (
            <p className="error" key={index}>
              {error.msg}
            </p>
          ))}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="basic-details">
            <div className="profile-picture">
              <img
                src={profilePicPreview}
                alt="Profile"
                className="profile-img"
              />
              <label>Upload image</label>
              <input
                type="file"
                name="profileimage"
                onChange={handleImageUpload}
              />
            </div>
            <br />
            <label>First name:</label>{" "}
            <input
              type="text"
              name="firstname"
              value={data.firstname}
              onChange={handleChange}
            />
            <label>Last name:</label>{" "}
            <input
              type="text"
              name="lastname"
              value={data.lastname}
              onChange={handleChange}
            />
            <label>Gender:</label>
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={data.gender === "Male"}
              onChange={handleChange}
            />
            <label>Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={data.gender === "Female"}
              onChange={handleChange}
            />
            <label>Female</label>
            <label>E-mail:</label>{" "}
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <label>Contact:</label>{" "}
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
            />
            <label>DOB:</label>{" "}
            <input
              type="date"
              name="dob"
              value={data.dob}
              onChange={handleChange}
            />
            <label>Expertise:</label>{" "}
            <input
              type="text"
              name="expertise"
              value={data.expertise}
              onChange={handleChange}
            />
          </div>
          <div className="bio">
            <label>Bio: </label>
            <textarea name="bio" value={data.bio} onChange={handleChange} />
          </div>
          <div className="goals">
            <label>Goals: </label>
            <textarea name="goals" value={data.goals} onChange={handleChange} />
          </div>
          <div className="interests">
            <label>Interests: </label>
            <textarea
              name="interests"
              value={data.interests}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update your profile</button>
          <button onClick={back}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default UpdateProfile;
