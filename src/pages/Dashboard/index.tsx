import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { IUser } from "../../types/database";
import User from "../../components/User";

interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = () => {
  const [users, setUsers] = useState([]);

  const auth = getAuth();

  const getUsers = async () => {
    const usersCall = await fetch(`${process.env.REACT_APP_API_URL}/user`);
    const users = await usersCall.json();
    const usersFiltered = users.filter((user: IUser) => user.type === "admin");
    setUsers(usersFiltered);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Family Users</div>

      <div>
        {users.map((user: IUser) => {
          return (
            <User
              _id={user._id}
              firebaseUserId={user.firebaseUserId}
              name={user.name}
              emailAddress={user.emailAddress}
              forgotPasswordCode={user.forgotPasswordCode}
              type={user.type}
              posts={user.posts}
              timestamp={user.timestamp}
              friends={user.friends}
              chats={user.chats}
              schedule={user.schedule}
            />
          );
        })}
      </div>
      <div></div>

      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
