import React, { useEffect, useState } from "react";
import { generateHmacSignature } from "../../utils/hmac";
import { IUser } from "../../types/database";
import "./index.css";

const ApproveUser = () => {
  interface ApproveType {
    [key: string]: boolean;
  }

  const [approveType, setApproveType] = useState<ApproveType>({
    staff: false,
    family: false,
  });

  const [unapproveType, setUnapproveType] = useState<ApproveType>({
    staff: false,
    family: false,
  });

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<IUser[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<IUser[]>([]);

  const [searchQueryApprove, setSearchQueryApprove] = useState("");
  const [searchQueryUnapprove, setSearchQueryUnapprove] = useState("");

  const loadUsers = async () => {
    const allUsers = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: "GET",
      headers: {
        "Friends-Life-Signature": generateHmacSignature(
          "GET",
          process.env.REACT_APP_API_KEY || ""
        ),
      },
    });
    const allUsersData = await allUsers.json();
    setAllUsers(allUsersData);
  };

  const handleCheckboxChange = (
    type: keyof typeof approveType,
    approve: boolean
  ) => {
    if (approve) {
      setApproveType({
        ...approveType,
        [type]: !approveType[type],
      });
    } else {
      setUnapproveType({
        ...unapproveType,
        [type]: !unapproveType[type],
      });
    }
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    approve: boolean
  ) => {
    if (approve) {
      setSearchQueryApprove(e.target.value);
    } else {
      setSearchQueryUnapprove(e.target.value);
    }
  };

  function filterTypes(approved: boolean) {
    if (approved) {
      return allUsers.filter(
        (user) =>
          approveType[user.type.toLowerCase()] === true &&
          user.approved === false &&
          user.name.toLowerCase().includes(searchQueryApprove.toLowerCase())
      );
    }
    return allUsers.filter(
      (user) =>
        unapproveType[user.type.toLowerCase()] === true &&
        user.approved == true &&
        user.name.toLowerCase().includes(searchQueryUnapprove.toLowerCase())
    );
  }

  useEffect(() => {
    setAllUsers([]);
    loadUsers();
    setApprovedUsers(filterTypes(true));
    setUnapprovedUsers(filterTypes(false));
  }, []);

  useEffect(() => {
    setApprovedUsers(filterTypes(true));
    setUnapprovedUsers(filterTypes(false));
  }, [approveType, unapproveType, searchQueryApprove, searchQueryUnapprove]);

  return (
    <div className="register-new-container">
      <div>
        <h1>Approve Users</h1>
      </div>
      <div className="full-container">
        <div className="split-left">
          <p>Click to approve</p>
          <div className="search-wrapper">
            <input
              className="approve-search-bar"
              type="text"
              placeholder="Search Unapproved Users..."
              value={searchQueryApprove}
              onChange={(e) => handleSearchChange(e, true)}
            />
          </div>
          <fieldset className="approve-schedule">
            {Object.keys(approveType).map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={approveType[type as keyof typeof approveType]}
                  onChange={() =>
                    handleCheckboxChange(type as keyof typeof approveType, true)
                  }
                />
                {type}
              </label>
            ))}
          </fieldset>

          {approvedUsers.map((user) => (
            <UserApprove
              id={user._id}
              approve={"approve"}
              name={user.name}
              pfp={user.profilePicture}
            />
          ))}
        </div>
        <div className="split-right">
          <p>Click to unapprove</p>
          <div className="search-wrapper">
            <input
              className="approve-search-bar"
              type="text"
              placeholder="Search Approved Users..."
              value={searchQueryUnapprove}
              onChange={(e) => handleSearchChange(e, false)}
            />
          </div>
          <fieldset className="approve-schedule">
            {Object.keys(unapproveType).map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={unapproveType[type as keyof typeof unapproveType]}
                  onChange={() =>
                    handleCheckboxChange(
                      type as keyof typeof unapproveType,
                      false
                    )
                  }
                />
                {type}
              </label>
            ))}
          </fieldset>

          {unapprovedUsers.map((user) => (
            <UserApprove
              id={user._id}
              approve={"unapprove"}
              name={user.name}
              pfp={user.profilePicture}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface IUserProps {
  id: string;
  approve: string;
  name: string;
  pfp: string;
}

const UserApprove: React.FC<IUserProps> = (props) => {
  const { id, approve, name, pfp } = props;

  const handleClick = async () => {
    const conf = window.confirm(`Are you sure you want to ${approve} ${name}?`);
    const appr = approve === "approve";
    try {
      if (conf) {
        console.log(id);
        console.log(appr);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Friends-Life-Signature": generateHmacSignature(
              JSON.stringify({ approved: appr }),
              process.env.REACT_APP_API_KEY || ""
            ),
          },
          body: JSON.stringify({ approved: appr }),
        });

        console.log(res.ok);

        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="family-item" onClick={() => handleClick()}>
      <div className="family-info">
        <img src={pfp} alt={`Profile of ${name}`} className="family-pfp" />
        <div className="family-name">{name}</div>
      </div>
    </div>
  );
};

export default ApproveUser;
