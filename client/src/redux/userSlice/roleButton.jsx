import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { updateUserRole } from "./userSlice";


const RoleButton = ({ user }) => {
    const dispatch = useDispatch();
  
    const handleRoleChange = () => {
      const updatedUser = { ...user, role: !user.role };
      dispatch(updateUserRole(updatedUser));
    };
  
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <Button danger onClick={handleRoleChange}>
          {user.role ? "Admin" : "User"}
        </Button>
      </div>
    );
  };
  
  export default RoleButton;