import React, { useState } from "react";
import Navbar from "../../components/navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loader from "../../components/loader";
import "../../assets/css/reviewCss/addReview.css";
import { useNavigate, useParams } from "react-router-dom";

function AddReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([false, false, false, false, false]);

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

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const rating = stars.filter((star) => star).length;
    const valuesData = { ...values, rating, revieweeId: id };
    axios
      .post("createReview", valuesData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success("Review Posted Successfully", {
            position: "top-right",
            autoClose: 800,
          });
          navigate("/reviews");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error("Error posting review", {
          position: "top-right",
          autoClose: 800,
        });
      });
  };

  const toggleRate = (index) => {
    const newStars = stars.map((_, i) => i <= index); //based on clicked index
    setStars(newStars);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="review-page-background">
        <Navbar />
        <div className="review-container">
          <form onSubmit={handleSubmit}>
            <div className="rate">
              <label style={{ marginRight: "15px", fontSize: "20px" }}>
                <strong>Rate</strong>
              </label>
              <div className="stars">
                {stars.map((isSolid, index) => (
                  <FontAwesomeIcon
                    key={index}
                    onClick={() => toggleRate(index)}
                    icon={isSolid ? faStar : faRegularStar}
                    style={{
                      color: "yellow",
                      cursor: "pointer",
                      fontSize: "30px",
                    }}
                  />
                ))}
              </div>
            </div>
            <br />
            <label>
              <strong>Leave a review:</strong>
            </label>
            <ReactQuill
              value={values.review || ""}
              onChange={(content) => handleChange(null, content, "review")}
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
            />
            <br />
            <div className="review-button-container">
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddReview;
