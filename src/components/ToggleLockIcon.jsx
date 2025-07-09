// ToggleLockIcon.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toggleLockByNames } from "../api/toggleLockByNames";

export default function ToggleLockIcon({ initialLock, patchName, imageName }) {
  const [isLocked, setIsLocked] = useState(initialLock);

  const handleToggle = async () => {
    const newValue = !isLocked;
    const updated = await toggleLockByNames(patchName, imageName, newValue);
    if (updated && typeof updated.lock === "boolean") {
      setIsLocked(updated.lock);
    } else {
      console.error("Failed to update lock on backend.");
    }
  };

  return (
    <IconButton
      onClick={handleToggle}
      aria-label={isLocked ? "Unlock" : "Lock"}
    >
      {isLocked ? <LockIcon /> : <LockOpenIcon />}
    </IconButton>
  );
}

ToggleLockIcon.propTypes = {
  initialLock: PropTypes.bool.isRequired,
  patchName:   PropTypes.string.isRequired,
  imageName:   PropTypes.string.isRequired,
};
