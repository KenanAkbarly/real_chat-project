import React from "react";
import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <div style={{ height: "90vh" }}>
      <lottie-player
        src="https://assets9.lottiefiles.com/packages/lf20_aaesnvcw.json"
        background="transparent"
        speed="1"
        loop
        autoplay></lottie-player>
      <div className="go_home">
        <Link to={"/"}>
          <button className="go_home_button">GO HOME</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
