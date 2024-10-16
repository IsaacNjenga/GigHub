import React, { useEffect, useState } from "react";
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

function UpdateReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([false, false, false, false, false]);

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

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ];

  useEffect(() => {
    const fetchUserReview = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`fetchReview/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          const review = res.data.review;
          console.log(res.data.review);
          setValues((prevValues) => ({ ...prevValues, review }));
          console.log(values);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching reviews:", error);
      }
    };
    fetchUserReview();
  }, [id]);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const rating = stars.filter((star) => star).length;
    const valuesData = { ...values, rating };
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
        {values ? (
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
                  Edit Review
                </button>
              </div>
            </form>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

export default UpdateReview;
