import React, { useEffect, useState } from "react";
import { IUser, IFriend } from "../types/database";
import Friend from "./Friend";

const User: React.FunctionComponent<IUser> = (props) => {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const getFriends = async (user: IUser) => {
    const uCall = await fetch(
      `${process.env.REACT_APP_API_URL}/user/${user._id}}`
    );
    const u = await uCall.json();
    const friendIds = u.friends;

    let friendsArr: IFriend[] = [];

    friendIds?.forEach(async (friendId: string) => {
      const friendCall = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/${friendId}}`
      );
      const friend: IFriend = await friendCall.json();
      setFriends([...friendsArr, friend]);
    });
  };

  const handleClick = () => {
    setPopupVisible(true);
  };

  const handleClose = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    getFriends(props);
  }, [isPopupVisible]);

  return (
    <div>
      <div onClick={handleClick}>
        <h2>{props.name}</h2>
        <div>{props.emailAddress}</div>
      </div>

      {isPopupVisible && (
        <div>
          <h3>Current Friends:</h3>
          {friends.map((friend: IFriend) => (
            <Friend name={friend.friendName} />
          ))}
          <h3>Add Friend:</h3>
          <input />
          <br />
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default User;
