import React from "react";

interface IFriendProps {
  name: string;
}

const Friend: React.FC<IFriendProps> = (props) => {
  const { name } = props;
  return (
    <div>
      <p>{name}</p>
    </div>
  );
};

export default Friend;
