import { getAuth, signOut } from "firebase/auth";

const NavBar = () => {
  const auth = getAuth();

  return (
    <div>
      <h1
      // onClick={() => {
      //   useNavigate();
      // }}>
      >
        Friends Life
      </h1>

      <button>Manage Staff</button>
      <button>Manage Users</button>
      <button>Manage Friends</button>
      <button>Register New</button>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
};

export default NavBar;
