import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Logout() {
  const { setUser } = useContext(UserContext);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  useEffect(() => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setUser(null);
        navigate("/");
      } else {
        navigate("/");
      }
    });
  }, [MySwal, setUser, navigate]);

  return <div className="logout"></div>;
}

export default Logout;
