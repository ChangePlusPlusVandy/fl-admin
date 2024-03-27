import React, { useState, useEffect } from "react";
import Family from "../../components/Family";
import ImageUpload from "../../components/ImageUpload";
import { useLocation } from "react-router-dom";

import "./index.css";
import { generateHmacSignature } from "../../utils/hmac";
import { IUser } from "../../types/database";

const FamilyPage: React.FC = () => {
  const location = useLocation();
  const { userId, name, pfp } = location.state;
  const [updateName, setUpdateName] = useState(name);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userPfp, setUserPfp] = useState(pfp);

  const [updateData, setUpdateData] = useState({
    name: updateName,
    phoneNumber: phoneNumber,
    profilePicture: userPfp,
  });

  const handleFriendImageUpload = (imageUrl: string) => {
    setUpdateData({ ...updateData, profilePicture: imageUrl });
  };

  const fetchUserData = async () => {
    try {
      const userData = await fetch(
        `${process.env.REACT_APP_API_URL}/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ userId }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
        }
      );

      const userInfo: IUser = await userData.json();

      setUpdateName(userInfo.name);
      setPhoneNumber(userInfo.phoneNumber);
      setUserPfp(userInfo.profilePicture);

      setUpdateData({
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        profilePicture: userInfo.profilePicture,
      });
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const saveChanges = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Friends-Life-Signature": generateHmacSignature(
            JSON.stringify({
              name: updateData.name,
              phoneNumber: updateData.phoneNumber,
              profilePicture: updateData.profilePicture,
            }),
            process.env.REACT_APP_API_KEY || ""
          ),
        },
        body: JSON.stringify({
          name: updateData.name,
          phoneNumber: updateData.phoneNumber,
          profilePicture: updateData.profilePicture,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="family-page-container">
      <h1>{updateName}</h1>
      <div className="family-page-header">
        <Family id={userId} name={updateName} pfp={userPfp} />
        <div className="edit-user">
          <h3>Edit Information</h3>
          <div className="edit-chunk">
            <span>Name: </span>
            <input
              type="text"
              value={updateData.name}
              onChange={(e) =>
                setUpdateData({ ...updateData, name: e.target.value })
              }
            />
          </div>
          <div className="edit-chunk">
            <span>Phone Number: </span>
            <input
              type="text"
              value={updateData.phoneNumber}
              onChange={(e) =>
                setUpdateData({ ...updateData, phoneNumber: e.target.value })
              }
            />
          </div>
          <div className="edit-chunk">
            <div className="user-image-upload">
              <span>Profile Picture: </span>
              <ImageUpload onImageUpload={handleFriendImageUpload} />
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              saveChanges();
            }}>
            Save Changes
          </button>
        </div>
      </div>
      <hr className="fam-hr" />
    </div>
  );
};

export default FamilyPage;
