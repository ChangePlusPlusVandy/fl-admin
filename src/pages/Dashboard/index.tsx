import React from "react";
import { getAuth, signOut } from "firebase/auth";

interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = () => {
  const auth = getAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Family Users</div>

      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
