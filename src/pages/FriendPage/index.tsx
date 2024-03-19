import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";

const FriendPage: React.FC = () => {
  let location = useLocation();
  const { friendId, name } = location.state;
  return (
    <div>
      <p>{friendId}</p>
      <p>{name}</p>
    </div>
  );
};

export default FriendPage;
