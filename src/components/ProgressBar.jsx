import React from "react";
import "./ProgressBar.css";

function ProgressBar({ value, label }) {
//   const clampedValue = Math.max(0, Math.min(100, value));
  const clampedValue = 60


  return (
    <div className="progress-wrapper">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      <div className="progress-percent">{clampedValue}%</div>
    </div>
  );
}

export default ProgressBar;
