import { useEffect, useState } from "react";

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  const isMobile: boolean = innerWidth < 600;
  const isTablet: boolean = innerWidth < 900;

  return { innerWidth, innerHeight, isMobile, isTablet };
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return windowSize;
};
