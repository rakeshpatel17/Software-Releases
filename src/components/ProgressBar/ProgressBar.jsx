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
      
      <div className="progress-row" >
           <Tooltip text="patch progress" position="top">
        <div className="progress-percent">{clampedValue}%</div>
        </Tooltip>
        <div className="progress-bar-background">
          
          <div
            className="progress-bar-fill"
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        
      </div>  
      
      </div>

  );
}

export default ProgressBar;
