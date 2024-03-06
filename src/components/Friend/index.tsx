import React from "react";
import "./index.css";

interface IFriendProps {
  id: string;
  name: string;
  pfp: string;
}

const Friend: React.FC<IFriendProps> = (props) => {
  const { id, name, pfp } = props;

  const selectFriend = (friendId: string) => {
    console.log(`Friend selected: ${friendId}`);
  };

  return (
    <div className="friend-item" onClick={() => selectFriend(id)}>
      <div className="friend-info">
        <img src={pfp} alt={`Profile of ${name}`} className="friend-pfp" />
        <div className="friend-name">{name}</div>
      </div>
    </div>
  );
};

export default Friend;
