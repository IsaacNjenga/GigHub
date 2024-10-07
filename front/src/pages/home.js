import React from "react";
import Navbar from "../components/navbar";
import "../assets/css/homeCss/home.css";

function Home() {
  return (
    <>
      <div className="home-background">
        <Navbar />
        <div className="home-container">
          <div>
            <h1>Find your perfect fit.</h1>
            <h2>Hire top-rated professionals for any project, big or small.</h2>
          </div>
          <div className="section">
            <p className="section-title">
              Struggling to find the right talent for your project?
            </p>
            <p>
              Our platfrom connects you with qualified freelancers who can
              deliver excpetional results
            </p>
            <p>Save time, money and effort</p>
          </div>
          <div>
            <h3>How it works</h3>
            <p>Step 1: Post your project and set your budget.</p>
            <p>Step 2: Receive proposals from qualified freelancers.</p>
            <p>Step 3: Review profiles, portfolios, and reviews.</p>
            <p>Step 4: Hire the best freelancer for your needs.</p>
          </div>
          <div>
            <button className="cta-button">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
