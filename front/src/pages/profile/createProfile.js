import React, { useState } from "react";
import { toast } from "react-toastify";
import defaultProfilePic from "../../assets/images/defaultProfilePic.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";

function CreateProfile() {
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [serverErrors, setServerErrors] = useState([]);
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value || e.target.id });
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
    console.log(profileData);
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
  return (
    <>
      {loading && <Loader />}
      <div>
        <h1>Create Your Profile</h1>
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
            <input type="text" name="firstname" onChange={handleChange} />
            <label>Last name:</label>{" "}
            <input type="text" name="lastname" onChange={handleChange} />
            <label>Gender:</label>
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
            <label>E-mail:</label>{" "}
            <input type="email" name="email" onChange={handleChange} />
            <label>Contact:</label>{" "}
            <input type="text" name="phone" onChange={handleChange} />
            <label>DOB:</label>{" "}
            <input type="date" name="dob" onChange={handleChange} />
            <label>Expertise:</label>{" "}
            <input type="text" name="expertise" onChange={handleChange} />
          </div>
          <div className="bio">
            <label>Bio: </label>
            <textarea name="bio" onChange={handleChange} />
          </div>
          <div className="goals">
            <label>Goals: </label>
            <textarea name="goals" onChange={handleChange} />
          </div>
          <div className="interests">
            <label>Interests: </label>
            <textarea name="interests" onChange={handleChange} />
          </div>
          <button type="submit">Create your profile</button>
        </form>
      </div>
    </>
  );
}

export default CreateProfile;
