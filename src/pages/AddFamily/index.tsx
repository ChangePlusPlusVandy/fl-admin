import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/database";
import { generateHmacSignature } from "../../utils/hmac";
import Family from "../../components/Family";
import "./index.css";

const AddFamily: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [family, setFamily] = useState<IUser[]>([]); // Replace IUser with your user type

  const fetchData = async () => {
    const signature = generateHmacSignature(
      "GET",
      process.env.REACT_APP_API_KEY || ""
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        headers: {
          "Friends-Life-Signature": signature,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const users = await response.json();
      const familyUsers = users.filter((user: IUser) => user.type === "Family");
      setFamily(familyUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="add-family-container">
      <h1>Add Family</h1>
      <span className="family-container-description">
        <p>Select one of the options below</p>
      </span>
      <div className="family-list">
        <p> Select a family: </p>
        {family.map((family) => (
          <Family
            id={family.key}
            name={family.name}
            pfp={family.profilePicture}
          />
        ))}
      </div>
    </div>
  );
};

export default AddFamily;
