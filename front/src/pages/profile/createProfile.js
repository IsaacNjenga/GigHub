import React, { useState } from "react";
import { toast } from "react-toastify";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import Navbar from "../../components/navbar";
import "../../assets/css/profileCss/createProfile.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateProfile() {
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [serverErrors, setServerErrors] = useState([]);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const handleChange = (e, content = null, fieldName = null) => {
    if (content !== null && fieldName !== null) {
      setValues({
        ...values,
        [fieldName]: content,
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
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
    const profileData = { ...values, profileImage: image };
    axios
      .post("createProfile", profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success("Profile created successfully", {
            position: "top-right",
            autoClose: 700,
          });
          navigate("/profile");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error creating profile", {
          position: "top-right",
          autoClose: 700,
        });
        if (err.response.data.errors) {
          setServerErrors(err.response.data.errors);
        }
        console.log(err);
      });
  };

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  return (
    <>
      {loading && <Loader />}
      <div className="create-background">
        <Navbar />
        <div className="profile-container">
          <h1>Create Your Profile</h1>
          <hr />
          {serverErrors.length > 0 &&
            serverErrors.map((error, index) => (
              <p className="error" key={index}>
                {error.msg}
              </p>
            ))}
          <div className="create-profile-form-container">
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

                <label>
                  <u>Personal Details</u>
                </label>
                <div className="personal-group">
                  <div>
                    <label>First name:</label>
                    <input
                      type="text"
                      name="firstname"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label>Last name:</label>
                    <input
                      type="text"
                      name="lastname"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
                <label>Gender:</label>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    checked={values.gender === "Male"}
                    onChange={handleChange}
                  />
                  <label>Male</label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    checked={values.gender === "Female"}
                    onChange={handleChange}
                  />
                  <label>Female</label>
                </div>

                <div className="personal-group">
                  <div>
                    <label>E-mail:</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label>Contact:</label>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="personal-group">
                  <div>
                    <label>DOB:</label>
                    <input
                      type="date"
                      name="dob"
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label>Expertise:</label>
                    <input
                      type="text"
                      name="expertise"
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
                    value={values.bio || ""}
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
                    value={values.goals || ""}
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
                    value={values.interests || ""}
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
              <button className="submit-btn" type="submit">
                Create your profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProfile;
