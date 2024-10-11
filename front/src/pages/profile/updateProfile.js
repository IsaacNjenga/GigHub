import React, { useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import axios from "axios";
import Navbar from "../../components/navbar";
import { UserContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import "../../assets/css/profileCss/updateProfile.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function UpdateProfile() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [values, setValues] = useState(false);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);
  const [profileName, setProfileName] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setProfileName(response.data.user);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    fetchUsername();
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.profile) {
        setValues(true);
      }
      const profileDetails = response.data.profile.find(
        (profile) => profile.postedBy === user._id
      );

      setData((prevData) => ({ ...prevData, ...profileDetails }));
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

  const handleChange = (e, content = null, fieldName = null) => {
    if (content !== null && fieldName !== null) {
      // Only update the state if the content has changed
      if (values[fieldName] !== content) {
        setValues({
          ...values,
          [fieldName]: content,
        });
      }
    } else {
      // Update state only if input value has changed
      if (values[e.target.name] !== e.target.value) {
        setValues({
          ...values,
          [e.target.name]: e.target.value,
        });
      }
    }
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
    const profileData = { ...data, profileImage: image, username: profileName };
    axios
      .put(`updateProfile/${id}`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
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

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  return (
    <>
      {loading && <Loader />}
      <div className="update-background">
        <Navbar />
        <div className="profile-container">
          <h1>Update Your Profile</h1>
          <hr />
          {serverErrors.length > 0 &&
            serverErrors.map((error, index) => (
              <p className="error" key={index}>
                {error.msg}
              </p>
            ))}
          <div className="update-profile-form-container">
            <form onSubmit={handleSubmit}>
              <div className="basic-details">
                <div className="profile-picture">
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="profile-img"
                  />
                  <br />
                  <input
                    type="file"
                    name="profileimage"
                    onChange={handleImageUpload}
                  />
                </div>
                <p>Username: {profileName}</p>
                <label>
                  <u>Personal Details</u>
                </label>
                <div className="name-group">
                  <div className="firstname">
                    <label>First name:</label>
                    <input
                      type="text"
                      name="firstname"
                      value={data.firstname}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div className="lastname">
                    <label>Last name:</label>
                    <input
                      type="text"
                      name="lastname"
                      value={data.lastname}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="gender-group">
                  <label>Gender:</label>
                  <div className="radio-group">
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
                  </div>
                </div>

                <div className="details-group1">
                  <label>E-mail:</label>
                  <div className="email">
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div className="contact">
                    <label>Contact:</label>
                    <input
                      type="text"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="details-group2">
                  <div className="dob">
                    <label>DOB:</label>
                    <input
                      type="date"
                      name="dob"
                      value={data.dob}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div className="expertise">
                    <label>Expertise:</label>
                    <input
                      type="text"
                      name="expertise"
                      value={data.expertise}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
                <br />
                <label>
                  <u>Profile Details</u>
                </label>
                <div className="bio">
                  <label>Bio: </label>
                  <ReactQuill
                    value={data.bio || ""}
                    onChange={(content) => handleChange(null, content, "bio")}
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                </div>
                <div className="goals">
                  <label>Goals: </label>
                  <ReactQuill
                    value={data.goals || ""}
                    onChange={(content) => handleChange(null, content, "goals")}
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                </div>
                <div className="interests">
                  <label>Interests: </label>
                  <ReactQuill
                    value={data.interests || ""}
                    onChange={(content) =>
                      handleChange(null, content, "interests")
                    }
                    theme="snow"
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                  />
                </div>
              </div>
              <div className="button-container">
                <button className="update-profile-btn" type="submit">
                  Update your profile
                </button>
                <button className="delete-profile-btn" onClick={back}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
