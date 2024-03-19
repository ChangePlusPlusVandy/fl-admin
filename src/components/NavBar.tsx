import { getAuth, signOut } from "firebase/auth";
import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../layout.css";
import "./styles/NavBar.css";

const NavBar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("manage-friends");

  const navigateTo = (page: SetStateAction<string>) => {
    setCurrentPage(page);
    navigate("/" + page);
  };

  const isCurrentPage = (page: string) => currentPage === page;

  return (
    <div className="navbar">
      <div className="fl-icon" onClick={() => navigateTo("")}>
        Friends Life
      </div>

      <div className="button-box">
        <button
          className={
            isCurrentPage("manage-friends")
              ? "selected-friends-button"
              : "unselected-friends-button"
          }
          onClick={() => navigateTo("manage-friends")}
        >
          Manage Friends
        </button>

        <button
          className={
            isCurrentPage("register")
              ? "selected-register-button"
              : "unselected-register-button"
          }
          onClick={() => navigateTo("register")}
        >
          Register New
        </button>

        <button className="logout-button" onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
