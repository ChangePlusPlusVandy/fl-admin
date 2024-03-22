import React, { useState } from "react";
import { generateHmacSignature } from "../../utils/hmac";
import ImageUpload from "../../components/ImageUpload";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import "./index.css";

const RegisterNew = () => {
  const auth = getAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const [regFriend, setRegFriend] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendData, setFriendData] = useState({
    profilePicture:
      "https://res.cloudinary.com/dvrcdxqex/image/upload/v1707870630/defaultProfilePic.png",
    schedule: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
  });

  const handleFriendImageUpload = (imageUrl: string) => {
    setFriendData({ ...friendData, profilePicture: imageUrl });
  };

  const handleCheckboxChange = (day: keyof typeof friendData.schedule) => {
    setFriendData({
      ...friendData,
      schedule: {
        ...friendData.schedule,
        [day]: !friendData.schedule[day],
      },
    });
  };

  const handleFriendSubmit = async () => {
    setLoading(true);
    let schedule = [0, 0, 0, 0, 0, 0, 0];
    if (friendData.schedule.Sunday) schedule[0] = 1;
    if (friendData.schedule.Monday) schedule[1] = 1;
    if (friendData.schedule.Tuesday) schedule[2] = 1;
    if (friendData.schedule.Wednesday) schedule[3] = 1;
    if (friendData.schedule.Thursday) schedule[4] = 1;
    if (friendData.schedule.Friday) schedule[5] = 1;
    if (friendData.schedule.Saturday) schedule[6] = 1;

    const signature = generateHmacSignature(
      JSON.stringify({
        friendName: friendName,
        profilePicture: friendData.profilePicture,
        schedule: schedule,
      }),
      process.env.REACT_APP_API_KEY || ""
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Friends-Life-Signature": signature,
        },
        body: JSON.stringify({
          friendName: friendName,
          profilePicture: friendData.profilePicture,
          schedule: schedule,
        }),
      });

      if (response.ok) {
        alert("Friend Registered");
      } else {
        alert("Failed to register friend");
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Failed to register friend:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const [regAdmin, setRegAdmin] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    emailAddress: "",
    password: "",
  });

  const handleAdminSubmit = async () => {
    try {
      setLoading(true);
      const firebaseUser = await createUserWithEmailAndPassword(
        auth,
        adminData.emailAddress,
        adminData.password
      );

      const signature = generateHmacSignature(
        JSON.stringify({
          name: adminData.name,
          emailAddress: adminData.emailAddress,
          firebaseUserId: firebaseUser.user.uid,
          profilePicture:
            "https://res.cloudinary.com/dvrcdxqex/image/upload/v1707870630/defaultProfilePic.png",
          approved: true,
          type: "admin",
        }),
        process.env.REACT_APP_API_KEY || ""
      );
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Friends-Life-Signature": signature,
        },
        body: JSON.stringify({
          name: adminData.name,
          emailAddress: adminData.emailAddress,
          firebaseUserId: firebaseUser.user.uid,
          profilePicture:
            "https://res.cloudinary.com/dvrcdxqex/image/upload/v1707870630/defaultProfilePic.png",
          approved: true,
          type: "admin",
        }),
      });

      console.log(await response.json());

      if (response.ok) {
        alert("Admin Registered");
      } else {
        alert("Failed to register admin");
        console.log(await response.json());
      }
    } catch (error) {
      alert("Failed to register admin");
      console.error("Failed to register admin:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="register-new-container">
      <div>
        <h1>Register New</h1>
        <span className="register-new-description">
          <p>Select one of the options below</p>
        </span>
        <div className="register-new-header">
          <button
            className="register-new-button"
            onClick={() => {
              setRegFriend(true);
              setRegAdmin(false);
            }}>
            Register New Friend
          </button>

          <button
            className="register-new-button"
            onClick={() => {
              setRegFriend(false);
              setRegAdmin(true);
            }}>
            Register New Admin
          </button>
        </div>
      </div>
      {regFriend && (
        <div className="register-new-friend">
          <h4>Register New Friend</h4>
          <form>
            <div className="register-new-friend-name">
              <p>Name:</p>
              <input
                type="text"
                placeholder="Full Name"
                value={friendName}
                onChange={(e) => {
                  e.preventDefault();
                  setFriendName(e.target.value);
                }}
              />
            </div>

            <div className="register-new-friend-pfp">
              <p>Profile Picture:</p>
              <ImageUpload onImageUpload={handleFriendImageUpload} />
            </div>
            <div>
              <span style={{ display: "inline-block" }}>Schedule:</span>
              <fieldset className="register-new-friend-schedule">
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
              Register
            </button>
          </form>
        </div>
      )}
      {regAdmin && (
        <div className="reg-admin">
          <h4>Register New Admin</h4>
          <form>
            <div className="register-new-friend-name">
              <p>Full Name:</p>
              <input
                type="text"
                placeholder="Name"
                value={adminData.name}
                onChange={(e) => {
                  e.preventDefault();
                  setAdminData({ ...adminData, name: e.target.value });
                }}
              />
            </div>
            <div className="register-new-friend-name">
              <p>Email:</p>
              <input
                type="email"
                placeholder="Email"
                value={adminData.emailAddress}
                onChange={(e) => {
                  e.preventDefault();
                  setAdminData({ ...adminData, emailAddress: e.target.value });
                }}
              />
            </div>
            <div className="register-new-friend-name">
              <p>Password:</p>
              <input
                type="text"
                placeholder="Password"
                value={adminData.password}
                onChange={(e) => {
                  e.preventDefault();
                  setAdminData({ ...adminData, password: e.target.value });
                }}
              />
            </div>
          </form>
          <button
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleAdminSubmit();
            }}>
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterNew;
