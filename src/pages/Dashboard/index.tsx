import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { IUser } from "../../types/database";
// import User from "../../components/User";
import { generateHmacSignature } from "../../utils/hmac";
import NavBar from "../../components/NavBar";

interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>(users);

  const handleSearch = (searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = (users || []).filter((user: IUser) => {
      return (
        searchTerm === "" ||
        (user?.name && user.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user?.emailAddress &&
          user.emailAddress.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });

    setFilteredUsers(filtered);
  };

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    handleSearch(inputValue);
  };

  const auth = getAuth();

  const getUsers = async () => {
    const signature = generateHmacSignature(
      "GET",
      process.env.REACT_APP_API_KEY || ""
    );
    const usersCall = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        "Friends-Life-Signature": signature,
      },
    });
    const users = await usersCall.json();
    const usersFiltered = users.filter((user: IUser) => user.type === "admin");
    setUsers(usersFiltered);
    setFilteredUsers(usersFiltered);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <NavBar />
      <h1>Dashboard</h1>
      <div>Family Users</div>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={handleChange}
        />
      </div>

      <div>
        {/* {filteredUsers.map((user: IUser) => {
          return (
            <User
              key={user.key}
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
        })} */}
      </div>
      <div></div>

      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
