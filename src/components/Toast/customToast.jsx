import React, { useRef, useEffect, useState } from 'react';
import { toast, CheckmarkIcon, ErrorIcon } from 'react-hot-toast';

const ARMING_DELAY = 2000; // 2 seconds of continuous hover to arm.
const DISMISS_DELAY = 3000; // 3 seconds after being armed, the toast is dismissed.
const EXIT_ANIMATION_DURATION = 300; // ms for our custom fade-out animation.


const FinalToast = ({ t, message, iconType }) => {
  // useState is now needed to trigger a re-render for the exit animation.
  const [isExiting, setIsExiting] = useState(false);

  // useRef continues to manage the core logic state without re-renders.
  const stateRef = useRef({
    isFuseLit: false,
    armingTimer: null,
  });

  // This effect handles cleanup to prevent memory leaks.
  useEffect(() => {
    return () => {
      if (stateRef.current.armingTimer) {
        clearTimeout(stateRef.current.armingTimer);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (stateRef.current.isFuseLit) return;
    
    stateRef.current.armingTimer = setTimeout(() => {
      if (stateRef.current.isFuseLit) return; // A safety check
      
      stateRef.current.isFuseLit = true;

      // Start the final, non-cancellable dismiss sequence.
      setTimeout(() => {
        // Trigger our custom exit animation by updating the state.
        setIsExiting(true);

        // After our exit animation finishes, call the real dismiss.
        setTimeout(() => {
          toast.dismiss(t.id);
        }, EXIT_ANIMATION_DURATION);

      }, DISMISS_DELAY);
    }, ARMING_DELAY);
  };

  const handleMouseLeave = () => {
    if (stateRef.current.isFuseLit) return;

    if (stateRef.current.armingTimer) {
      clearTimeout(stateRef.current.armingTimer);
    }
  };

  // Base styles for the toast
  const baseStyle = {
    background: 'white',
    color: '#363636',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
    gap: '12px',
    transition: `opacity ${EXIT_ANIMATION_DURATION}ms ease-out`,
    opacity: 1,
  };

  // Styles for the entrance animation (provided by the library)
  const entranceStyle = {
    animation: t.visible ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-in forwards',
  };

  // Styles for our custom exit animation
  const exitStyle = {
    opacity: 0,
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...baseStyle,
        ...entranceStyle,
        ...(isExiting && exitStyle),
      }}
    >
      {iconType === 'success' && <CheckmarkIcon />}
      {iconType === 'error' && <ErrorIcon />}
      <span style={{ flex: 1, userSelect: 'none' }}>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: 'transparent', border: 'none', padding: '0', margin: '0',
          cursor: 'pointer', color: '#888', fontSize: '18px', lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
};


export const dismissibleError = (message) => {
  toast.custom(
    (t) => <FinalToast t={t} message={message} iconType="error" />,
    { duration: Infinity }
  );
};

export const dismissibleSuccess = (message) => {
  toast.custom(
    (t) => <FinalToast t={t} message={message} iconType="success" />,
    { duration: Infinity }
  );
};