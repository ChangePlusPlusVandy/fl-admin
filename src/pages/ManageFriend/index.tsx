import React, { useState, useEffect } from "react";
import { IFriend } from "../../types/database";
import { generateHmacSignature } from "../../utils/hmac";
import Friend from "../../components/Friend";
import "./index.css";

const ManageFriend: React.FC = () => {
  const [friends, setFriends] = useState<IFriend[]>([]); // Replace IUser with your user type

  const fetchData = async () => {
    const signature = generateHmacSignature(
      "GET",
      process.env.REACT_APP_API_KEY || ""
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/friend`, {
        headers: {
          "Friends-Life-Signature": signature,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const friends = await response.json();
      console.log(friends)
       setFriends(friends);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  return (
    <div className="manage-friends-container">
      <h1>Manage Friends</h1>
      <p>View your friends and add/delete as you see fit</p>

      <div className="friends-list">
        <p> Select a friend: </p>
        {friends.map((friend) => (
          <Friend id={friend._id} name={friend.friendName} pfp={friend.profilePicture} />
        ))}
      </div>
    </div>
  );
};

export default ManageFriend;
