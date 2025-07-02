import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const ToggleLockIcon = () => {
  const [isLocked, setIsLocked] = useState(true);

  const handleToggle = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <IconButton onClick={handleToggle} aria-label={isLocked ? "Lock" : "Unlock"}>
      {isLocked ? <LockIcon /> : <LockOpenIcon />}
    </IconButton>
  );
};

export default ToggleLockIcon;