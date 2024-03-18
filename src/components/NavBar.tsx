import { getAuth, signOut } from "firebase/auth";

import "../layout.css";
import "./styles/NavBar.css";

const NavBar = () => {
  const auth = getAuth();

  return (
    <div className="navbar">
      <h1
      // onClick={() => {
      //   useNavigate();
      // }}>
      >
        Friends Life
      </h1>

      <button className="selection-button">Manage Staff</button>
      <button className="selection-button">Manage Users</button>
      <button className="selection-button">Manage Friends</button>
      <button>Register New</button>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
};

export default NavBar;
