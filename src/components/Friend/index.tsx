import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

interface IFriendProps {
  id: string;
  name: string;
  pfp: string;
}

const Friend: React.FC<IFriendProps> = (props) => {
  const navigate = useNavigate();

  const { id, name, pfp } = props;

  const selectFriend = (friendId: string, name: string, pfp: string) => {
    navigate("/friend", {
      state: { friendId: friendId, name: name, pfp: pfp },
    });
  };

  return (
    <div className="friend-item" onClick={() => selectFriend(id, name, pfp)}>
      <div className="friend-info">
        <img src={pfp} alt={`Profile of ${name}`} className="friend-pfp" />
        <div className="friend-name">{name}</div>
      </div>
    </div>
  );
};

export default Friend;
