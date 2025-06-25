import React from "react";
import "./ToolTip.css";

const Tooltip = ({ text, position = "top", children }) => {
  return (
    <div className={`tooltip-container ${position}`}>
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
};

export default Tooltip;
