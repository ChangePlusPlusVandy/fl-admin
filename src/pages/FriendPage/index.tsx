import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Friend from "../../components/Friend";
import { generateHmacSignature } from "../../utils/hmac";
import "./index.css";
import { IFriend, IUser } from "../../types/database";
import Family from "../../components/Family";

const FriendPage: React.FC = () => {
  const location = useLocation();
  const { friendId, name, pfp } = location.state;

  const [families, setFamilies] = useState<IUser[]>([]);

  const loadFriend = async () => {
    try {
      const friendData = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/${friendId}`,
        {
          method: "GET",
          headers: {
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ friendId }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
        }
      );

      const friendInfo: IFriend = await friendData.json();

      const fams = friendInfo.families;

      const familyPromises = fams.map(async (familyId: string) => {
        const familyData = await fetch(
          `${process.env.REACT_APP_API_URL}/user/${familyId}`,
          {
            method: "GET",
            headers: {
              "Friends-Life-Signature": generateHmacSignature(
                JSON.stringify({ userId: familyId }),
                process.env.REACT_APP_API_KEY || ""
              ),
            },
          }
        );

        return familyData.json();
      });

      const resolvedFamilies = await Promise.all(familyPromises);
      setFamilies(resolvedFamilies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFamilies([]);
    loadFriend();
  }, []);

  return (
    <div className="manage-friends-container">
      <h1>{name}</h1>
      <div className="friend-wrapper">
        <div className="friends-list">
          <Friend id={friendId} name={name} pfp={pfp} />
        </div>
      </div>

      <hr className="custom-hr" />

      <div className="friend-detail-wrapper">
        <h2>Current Family Users</h2>
        <p>Click to unlink family user</p>
        <div className="families-list">
          {families.map((family) => (
            <FamilyRemovable
              id={family._id}
              friendId={friendId}
              name={family.name}
              pfp={family.profilePicture}
              otherF={families}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface IFriendProps {
  id: string;
  friendId: string;
  name: string;
  pfp: string;
  otherF: IUser[];
}

const FamilyRemovable: React.FC<IFriendProps> = (props) => {
  const { id, friendId, name, pfp } = props;
  let { otherF } = props;

  const handleRemove = async () => {
    const conf = window.confirm(
      `Are you sure you want to unlink ${name} from the friend?`
    );
    try {
      if (conf) {
        otherF = otherF.filter((f: IUser) => f._id !== id);
        await fetch(`${process.env.REACT_APP_API_URL}/friend/${friendId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ families: otherF }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
          body: JSON.stringify({ families: otherF }),
        });

        const user = await fetch(
          `${process.env.REACT_APP_API_URL}/user/${id}`,
          {
            method: "GET",
            headers: {
              "Friends-Life-Signature": generateHmacSignature(
                JSON.stringify({ userId: id }),
                process.env.REACT_APP_API_KEY || ""
              ),
            },
          }
        );

        const userInfo: IUser = await user.json();

        let curFriends = userInfo.friends;
        curFriends = curFriends.filter((f: string) => f !== friendId);

        await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ friends: curFriends }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
          body: JSON.stringify({ friends: curFriends }),
        });

        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="friend-item" onClick={() => handleRemove()}>
      <div className="friend-info">
        <img src={pfp} alt={`Profile of ${name}`} className="friend-pfp" />
        <div className="friend-name">{name}</div>
      </div>
    </div>
  );
};

export default FriendPage;
