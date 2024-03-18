import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { initializeApp } from "firebase/app";
import AuthRoute from "./components/AuthRoute";

// pages
import Dashboard from "./pages/Dashboard";
import "./layout.css";
import NavBar from "./components/NavBar";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        ></Route>
        <Route path="*" element={<Outlet />} />
      </Routes>
    </div>
  );
};

export default AppLayout;
