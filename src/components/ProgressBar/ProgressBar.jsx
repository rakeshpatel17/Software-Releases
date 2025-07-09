import "./ProgressBar.css";
import Tooltip from '../ToolTip/ToolTip';

function ProgressBar({ value = 0, label, onClick }) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const wrapperClass = `progress-wrapper ${onClick ? 'clickable' : ''}`;

  return (

    <div className={wrapperClass} onClick={onClick}>
      
      <div className="progress-row">
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