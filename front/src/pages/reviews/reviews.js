import React, { useContext, useState } from "react";
import Navbar from "../../components/navbar";
import { UserContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";

function Reviews() {
  const { user } = useContext(UserContext);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(values);
    axios
      .post("createReview", values, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success("Review Posted Successfully", {
            position: "top-right",
            autoClose: 800,
          });
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
  return (
    <>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Username:{" "}
            {user.username.replace(/^./, user.username[0].toUpperCase())}
          </label>
          <br />
          <label>Rating:</label>
          <input type="number" name="rating" onChange={handleChange} />
          <br />
          <label>Review:</label>
          <textarea name="review" onChange={handleChange} />
          <br />
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </>
  );
}

export default Reviews;
