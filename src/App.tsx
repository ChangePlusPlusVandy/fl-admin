import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { Analytics } from "@vercel/analytics/react";

// pages
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import AppLayout from "./AppLayout";
import "./layout.css";
import Eula from "./pages/Eula/EULA";

initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Analytics /> */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<AppLayout />} />
        <Route path="/eula" element={<Eula />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
