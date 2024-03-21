import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";

const FamilyPage: React.FC = () => {
  let location = useLocation();
  const { userId, name } = location.state;
  return (
    <div>
      <p>{userId}</p>
      <p>{name}</p>
    </div>
  );
};

export default FamilyPage;
