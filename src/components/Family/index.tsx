import React from "react";
import "./index.css";

interface IFamilyProps {
  id: string;
  name: string;
  pfp: string;
}

const Family: React.FC<IFamilyProps> = (props) => {
  const { id, name, pfp } = props;

  const selectFamily = (familyId: string) => {
    console.log(`Family selected: ${familyId}`);
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
