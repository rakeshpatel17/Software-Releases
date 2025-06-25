import { useNavigate } from 'react-router-dom';
import { RouteContext } from '../RouteContext/RouteContext';
import Tooltip from '../ToolTip/ToolTip';
import { useContext } from 'react';

function ForwardButtonComponent() {
    const navigate = useNavigate();
    const { forwardPath } = useContext(RouteContext);

    const tooltip = forwardPath ? ` ${forwardPath}` : '';

   return (
  <div style={{ display: 'inline-block' }}>
    {tooltip ? (
      <Tooltip text={tooltip} position='right'>
        <button
          onClick={() => navigate(1)}
          style={{
            padding: '8px 12px',
            borderRadius: '5px',
            backgroundColor: '#e2e8f0',
            border: '1px solid #cbd5e0',
            cursor: 'pointer',
            marginTop: '-20px',
            marginLeft: '6px'
          }}
          className="nav-btn"
        >
          →
        </button>
      </Tooltip>
    ) : (
      <button
        onClick={() => navigate(1)}
        style={{
          padding: '8px 12px',
          borderRadius: '5px',
          backgroundColor: '#e2e8f0',
          border: '1px solid #cbd5e0',
          cursor: 'pointer',
          marginTop: '-20px',
          marginLeft: '6px'
        }}
        className="nav-btn"
      >
        →
      </button>
    )}
  </div>
);

}

export default ForwardButtonComponent;
