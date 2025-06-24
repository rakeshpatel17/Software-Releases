import "./ProgressBar.css";
import { useNavigate } from "react-router-dom";
import Tooltip from '../ToolTip/ToolTip';



function ProgressBar({ value = 0, label, redirectTo = "/dashboard" }) {
  const clampedValue = Math.max(0, Math.min(100, value));
  //const clampedValue = 60
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(redirectTo);
  };
  return (
    <div className="progress-wrapper clickable" onClick={handleClick}>
      {/* {label && <div className="progress-label">{label}</div>} */}
      <Tooltip text="Click to view patch progress" position="down">

        <div className="progress-label">progress</div>
      </Tooltip>

      <div className="progress-row" >
        <div className="progress-bar-background">
          <div
            className="progress-bar-fill"
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        <div className="progress-percent">{clampedValue}%</div>
      </div></div>

  );
}

export default ProgressBar;
