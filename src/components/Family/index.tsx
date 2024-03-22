import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

interface IFamilyProps {
  id: string;
  name: string;
  pfp: string;
}

const Family: React.FC<IFamilyProps> = (props) => {
  const navigate = useNavigate();
  const { id, name, pfp } = props;

  const selectFamily = (familyId: string) => {
    navigate("/user", { state: { userId: id, name: name } });
  };

  return (
    <div className="family-item" onClick={() => selectFamily(id)}>
      <div className="family-info">
        <img src={pfp} alt={`Profile of ${name}`} className="family-pfp" />
        <div className="family-name">{name}</div>
      </div>
    </div>
  );
};

export default Family;
