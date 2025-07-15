// src/hooks/useScrollRestoration.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

export default function useScrollRestoration() {
  const location = useLocation();
  const pathname = location.pathname;
  const shouldRestore = useRef(true);

  // On mount / route change: scroll to saved position
  useEffect(() => {
    if (shouldRestore.current) {
      const pos = scrollPositions[pathname] || 0;
      window.scrollTo(0, pos);
    }
    shouldRestore.current = true;
  }, [pathname]);

  // Before unmount / navigating away: save scroll
  useEffect(() => {
    return () => {
      scrollPositions[pathname] = window.pageYOffset;
      // prevent immediate restore if you navigate programmatically
      shouldRestore.current = true;
    };
  }, [pathname]);
}
