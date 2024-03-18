import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { initializeApp } from "firebase/app";
import AuthRoute from "./components/AuthRoute";

// pages
import Dashboard from "./pages/Dashboard";
import "./layout.css";
import NavBar from "./components/NavBar";
import ManageFriend from "./pages/ManageFriend";

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
        <Route
          path="/manage-friends"
          element={
            <AuthRoute>
              <ManageFriend />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/manage-users"
          element={
            <AuthRoute>
              <ManageFriend />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/manage-staff"
          element={
            <AuthRoute>
              <ManageFriend />
            </AuthRoute>
          }
        ></Route>
        <Route path="*" element={<Outlet />} />
      </Routes>
    </div>
  );
};

export default AppLayout;
