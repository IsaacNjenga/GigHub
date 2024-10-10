import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { UserContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import Loader from "../../components/loader";
import "../../assets/css/reviewCss/review.css";

function Reviews() {
  const { user } = useContext(UserContext);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [users, setUsers] = useState([]);
  const [userView, setUserView] = useState([]);
  console.log(user);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("fetchProfile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setUsers(res.data.profile);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsersReviews = async () => {
      setLoading(true);
      const reviews = [];

      for (const user of users) {
        try {
          const res = await axios.get(
            `fetchLastChatForUser?recipientId=${user.postedBy}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.data.success) {
            reviews.push({
              user,
              lastMessage: res.data.lastChat
                ? res.data.lastChat.message
                : "No messages yet",
            });
          }
        } catch (error) {
          console.log("Error fetching last chat:", error);
        }
        setUserView(reviews);
        setLoading(false);
      }
    };
    fetchUsersReviews();
  }, [users]);

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
        <div className="reviews-container">
          <div className="users-div">
            <h2>Users</h2>
            <input
              type="text"
              placeholder="Search..."
              className="reviews-search-bar"
            />
            <br />
            <br />
            <div>
              {userView.map(({ user }) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedReceiver(user);
                    setSelectedReceiverId(user.postedBy);
                  }}
                  className={`chat-item ${
                    selectedReceiver?._id === user._id ? "active" : ""
                  }`}
                >
                  <div className="chat-info">
                    <img
                      src={user.profileImage}
                      alt="avatar"
                      className="chat-pfp"
                    />
                    <div className="user-details">
                      <p className="username">@{user.username}</p>
                      <p className="name">
                        {user.firstname} {user.lastname}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* separator */}
          <div className="review-div">
            <div className="review-container">
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
                <div className="reviews-button-container">
                  <button className="edit-review-btn">Edit</button>
                  <button className="delete-review-btn">Delete</button>
                </div>
              </div>
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>{" "}
              <br />
              <hr />
              <div>
                <h2>Mary</h2>
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <p>5/5</p>
                <p>
                  I had the pleasure of working with Greg on my project. Their
                  skill and attention to detail, communication skills &
                  creativity was exceptional. He consistently delivered
                  high-quality work that exceeded my expectations. Greg was a
                  pleasure to work with. He was reliable, professional. He were
                  always willing to go the extra mile to ensure my satisfaction.
                  I would highly recommend Greg to anyone in need of graphics
                  design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reviews;
