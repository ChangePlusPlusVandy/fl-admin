import React, { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/database";
import { generateHmacSignature } from "../../utils/hmac";
import "./index.css";
import logoImage from "../../assets/fl-logo.png"; // Adjust the path to where your image is located
import rightImage from "../../assets/login-right.png";

const LoginPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginMessage, setLoginMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
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
      const isAdmin = users.some(
        (user: IUser) =>
          user.type === "admin" && user.firebaseUserId === result.user.uid
      );

      if (isAdmin) {
        navigate("/");
      } else {
        alert("You are not an admin");
        await result.user.delete();
        await auth.signOut();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailPassword = async () => {
    setLoading(true);
    try {
      console.log("sd");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

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
      const admins = users
        .filter((user: IUser) => user.type === "admin")
        .map((admin: IUser) => admin.firebaseUserId);

      if (admins.includes(userCredential.user.uid)) {
        navigate("/");
      } else {
        auth.signOut();
        setLoginMessage("You are not an admin");
      }
    } catch (error: any) {
      setLoginMessage(error.message);
      console.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <div className="login-logo">
          <img src={logoImage} alt="Friends Life logo" />
        </div>

        <div className="email-password-section">
          <h3>Welcome to</h3>
          <h1>
            <b>Friends Life</b>
          </h1>
          <button onClick={signInWithGoogle}>Sign In With Google</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInWithEmailPassword();
            }}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {loginMessage !== "" && (
              <div className="login-message">{loginMessage}</div>
            )}
            <button type="submit" disabled={loading}>
              Log in
            </button>
          </form>
        </div>
      </div>
      <div className="right-image">
        <img src={rightImage} alt="" />
      </div>
    </div>
  );
};

export default LoginPage;
