import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const location = useLocation();
  const [historyStack, setHistoryStack] = useState([location.pathname]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const newPath = location.pathname;

    // Check if forward
    if (currentIndex < historyStack.length - 1 && historyStack[currentIndex + 1] === newPath) {
      setCurrentIndex(currentIndex + 1);
    }
    // Check if backward
    else if (currentIndex > 0 && historyStack[currentIndex - 1] === newPath) {
      setCurrentIndex(currentIndex - 1);
    }
    // Else, it's a new navigation (push new path)
    else {
      const updatedStack = historyStack.slice(0, currentIndex + 1);
      updatedStack.push(newPath);
      setHistoryStack(updatedStack);
      setCurrentIndex(updatedStack.length - 1);
    }
  }, [location]);

  const previousPath = currentIndex > 0 ? historyStack[currentIndex - 1] : null;
  const forwardPath = currentIndex < historyStack.length - 1 ? historyStack[currentIndex + 1] : null;

  return (
    <RouteContext.Provider value={{ previousPath, forwardPath, currentPath: historyStack[currentIndex] }}>
      {children}
    </RouteContext.Provider>
  );
};
