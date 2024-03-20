import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";
import Friend from "../../components/Friend";

const FriendPage: React.FC = () => {
  let location = useLocation();
  const { friendId, name, pfp } = location.state;
  return (
    <div className="manage-friends-container">
      <h1>{name}</h1>
      <div className="friends-list">
          <Friend id={friendId} name={name} pfp={pfp} />
      </div>
      <hr className="custom-hr" />
    </div>
      
  );
};

export default FriendPage;
