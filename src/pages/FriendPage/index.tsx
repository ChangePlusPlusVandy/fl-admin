import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Friend from "../../components/Friend";
import { generateHmacSignature } from "../../utils/hmac";
import "./index.css";
import { IFriend, IUser } from "../../types/database";
import ImageUpload from "../../components/ImageUpload";

const FriendPage: React.FC = () => {
  const location = useLocation();
  const { friendId, name, pfp } = location.state;

  const [families, setFamilies] = useState<IUser[]>([]);
  const [allFamilies, setAllFamilies] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [updateName, setUpdateName] = useState(name);
  const [updatePFP, setUpdatePFP] = useState(pfp);
  const [friendData, setFriendData] = useState({
    friendName: "",
    profilePicture:
      "https://res.cloudinary.com/dvrcdxqex/image/upload/v1707870630/defaultProfilePic.png",
    schedule: {
      Sun: false,
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
    },
  });

  const handleFriendImageUpload = (imageUrl: string) => {
    setFriendData({ ...friendData, profilePicture: imageUrl });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFamilies = allFamilies.filter((family) =>
    family.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (day: keyof typeof friendData.schedule) => {
    setFriendData({
      ...friendData,
      schedule: {
        ...friendData.schedule,
        [day]: !friendData.schedule[day],
      },
    });
  };

  const loadFriend = async () => {
    try {
      const friendData1 = await fetch(
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

      const friendInfo: IFriend = await friendData1.json();

      const newSchedule = {
        Sun: !!friendInfo.schedule[0],
        Mon: !!friendInfo.schedule[1],
        Tue: !!friendInfo.schedule[2],
        Wed: !!friendInfo.schedule[3],
        Thu: !!friendInfo.schedule[4],
        Fri: !!friendInfo.schedule[5],
        Sat: !!friendInfo.schedule[6],
      };

      setUpdateName(friendInfo.friendName);
      setUpdatePFP(friendInfo.profilePicture);

      setFriendData({
        friendName: friendInfo.friendName,
        profilePicture: friendInfo.profilePicture,
        schedule: newSchedule,
      });

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

      const allFams = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "GET",
        headers: {
          "Friends-Life-Signature": generateHmacSignature(
            "GET",
            process.env.REACT_APP_API_KEY || ""
          ),
        },
      });

      const allFamsData = await allFams.json();

      setAllFamilies(
        allFamsData.filter(
          (f: IUser) => f.type === "Family" && !fams.includes(f._id)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendSubmit = async () => {
    setLoading(true);
    try {
      let schedule = [0, 0, 0, 0, 0, 0, 0];
      if (friendData.schedule.Sun) schedule[0] = 1;
      if (friendData.schedule.Mon) schedule[1] = 1;
      if (friendData.schedule.Tue) schedule[2] = 1;
      if (friendData.schedule.Wed) schedule[3] = 1;
      if (friendData.schedule.Thu) schedule[4] = 1;
      if (friendData.schedule.Fri) schedule[5] = 1;
      if (friendData.schedule.Sat) schedule[6] = 1;

      await fetch(`${process.env.REACT_APP_API_URL}/friend/${friendId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Friends-Life-Signature": generateHmacSignature(
            JSON.stringify({
              friendName: friendData.friendName,
              profilePicture: friendData.profilePicture,
              schedule,
            }),
            process.env.REACT_APP_API_KEY || ""
          ),
        },
        body: JSON.stringify({
          friendName: friendData.friendName,
          profilePicture: friendData.profilePicture,
          schedule,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const conf = window.confirm(
      `Are you sure you want to delete ${updateName}?`
    );
    try {
      if (conf) {
        //deleting friend doc
        // await fetch(`${process.env.REACT_APP_API_URL}/friend/${friendId}`, {
        //   method: "DELETE",
        //   headers: {
        //     "Friends-Life-Signature": generateHmacSignature(
        //       JSON.stringify({ friendId }),
        //       process.env.REACT_APP_API_KEY || ""
        //     ),
        //   },
        // });

        window.location.href = "/manage-friends";
        alert("Friend deleted successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFriendData({
      friendName: name,
      profilePicture: pfp,
      schedule: friendData.schedule,
    });
    setFamilies([]);
    loadFriend();
  }, []);

  return (
    <div className="manage-friends-container">
      <h1>{updateName}</h1>
      <div className="friend-wrapper">
        <div className="friends-list">
          <Friend id={friendId} name={updateName} pfp={updatePFP} />
        </div>
        <div className="reg-new-friend">
          <h3>Edit Information</h3>
          <form>
            <div className="reg-new-friend-name">
              <p>Name:</p>
              <input
                type="text"
                placeholder="Full Name"
                value={friendData.friendName}
                onChange={(e) => {
                  e.preventDefault();
                  setFriendData({
                    friendName: e.target.value,
                    profilePicture: friendData.profilePicture,
                    schedule: friendData.schedule,
                  });
                }}
              />
            </div>

            <div className="reg-new-friend-pfp">
              <p>Profile Picture:</p>
              <ImageUpload onImageUpload={handleFriendImageUpload} />
            </div>
            <div>
              <span style={{ display: "inline-block", marginTop: "10px" }}>
                Schedule:
              </span>
              <fieldset className="reg-new-friend-schedule">
                {Object.keys(friendData.schedule).map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={
                        friendData.schedule[
                          day as keyof typeof friendData.schedule
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          day as keyof typeof friendData.schedule
                        )
                      }
                    />
                    {day}
                  </label>
                ))}
              </fieldset>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleFriendSubmit();
              }}>
              Save
            </button>
            {/* <br></br>
            <button
              style={{ color: "red" }}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}>
              Delete Friend
            </button> */}
          </form>
        </div>
      </div>

      <hr className="custom-hr" />

      <div className="friend-detail-wrapper">
        <div>
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

        <div>
          <br></br>
          <h2>Add Family User</h2>
          <p>Click to link family user</p>

          <div className="families-list">
            <input
              className="search-bar"
              type="text"
              placeholder="Search Family Users..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {filteredFamilies.map((user) => (
              <FamilyAddable
                id={user._id}
                friendId={friendId}
                name={user.name}
                pfp={user.profilePicture}
                friends={user.friends}
              />
            ))}
          </div>
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

interface IFamilyProps {
  id: string;
  friendId: string;
  name: string;
  pfp: string;
  friends: string[];
}

const FamilyAddable: React.FC<IFamilyProps> = (props) => {
  const { id, friendId, name, pfp } = props;
  let { friends } = props;

  const handleAdd = async () => {
    const conf = window.confirm(
      `Are you sure you want to link ${name} to the friend?`
    );
    try {
      if (conf) {
        friends.push(friendId);
        await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ friends }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
          body: JSON.stringify({ friends }),
        });

        const friend = await fetch(
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

        const friendInfo: IFriend = await friend.json();

        let fams = friendInfo.families;
        fams.push(id);

        await fetch(`${process.env.REACT_APP_API_URL}/friend/${friendId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ families: fams }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
          body: JSON.stringify({ families: fams }),
        });

        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="family-item" onClick={() => handleAdd()}>
      <div className="family-info">
        <img src={pfp} alt={`Profile of ${name}`} className="family-pfp" />
        <div className="family-name">{name}</div>
      </div>
    </div>
  );
};

export default FriendPage;
