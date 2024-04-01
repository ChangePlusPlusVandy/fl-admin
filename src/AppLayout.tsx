import { Routes, Route, Outlet } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";

// pages
import Dashboard from "./pages/Dashboard";
import "./layout.css";
import NavBar from "./components/NavBar";
import ManageFriend from "./pages/ManageFriend";
import AddFamily from "./pages/AddFamily";
import FriendPage from "./pages/FriendPage";
import RegisterNew from "./pages/RegisterNew";
import FamilyPage from "./pages/FamilyPage";
import ApproveUser from "./pages/ApproveUser";
import ExportData from "./pages/ExportData";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <AuthRoute>
        <NavBar />
      </AuthRoute>
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
          path="/register"
          element={
            <AuthRoute>
              <RegisterNew />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/friend"
          element={
            <AuthRoute>
              <FriendPage />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/manage-family"
          element={
            <AuthRoute>
              <AddFamily />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/user"
          element={
            <AuthRoute>
              <FamilyPage />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/approve-user"
          element={
            <AuthRoute>
              <ApproveUser />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/export-data"
          element={
            <AuthRoute>
              <ExportData />
            </AuthRoute>
          }
        ></Route>
        <Route path="*" element={<Outlet />} />
      </Routes>
    </div>
  );
};

export default AppLayout;
