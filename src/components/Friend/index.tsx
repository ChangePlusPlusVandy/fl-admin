import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

interface IFriendProps {
  id: string;
  name: string;
  pfp: string;
}

const Friend: React.FC<IFriendProps> = (props) => {
  const navigate = useNavigate();

  const { id, name, pfp } = props;

  const selectFriend = (friendId: string, name: string) => {
    navigate("/friend", { state: { friendId: friendId, name: name } });
  };

  return (
    <div className="friend-item" onClick={() => selectFriend(id, name)}>
      <div className="friend-info">
        <img src={pfp} alt={`Profile of ${name}`} className="friend-pfp" />
        <div className="friend-name">{name}</div>
      </div>
    </div>
  );
};

export default Friend;
