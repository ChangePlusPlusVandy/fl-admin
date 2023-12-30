import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/database";

const LoginPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (user) => {
        const usersCall = await fetch(`${process.env.REACT_APP_API_URL}/user`);
        const users = await usersCall.json();
        const admins = users
          .filter((user: IUser) => (user.type = "admin"))
          .map((admin: IUser) => admin.firebaseUserId);

        if (admins.includes(user.user.uid)) {
          navigate("/");
        } else {
          auth.signOut();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Login Page</h1>

      <button
        onClick={async () => {
          await signInWithGoogle();
        }}>
        Sign In With Google
      </button>
    </div>
  );
};

export default LoginPage;
