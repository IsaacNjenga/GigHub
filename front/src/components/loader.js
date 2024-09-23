import React from "react";
import "../assets/css/loader.css";

function Loader() {
  return (
    <>
      <div className="loader-container">
        <div className="loader">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </>
  );
}

export default Loader;
