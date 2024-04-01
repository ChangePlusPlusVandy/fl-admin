import "./index.css";
import FriendsLifeLogo from "../../assets/friends-life-logo.png";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard. Please use the navbar on the left!</p>
      <div className="image-container">
        <img src={FriendsLifeLogo}
        alt="Friends Life Logo" 
        style={{ width: '30vw' }}  />
      </div>
    </div>
  )
};

export default Dashboard;
