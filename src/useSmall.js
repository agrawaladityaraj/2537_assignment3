import { useState, useEffect } from "react";

const useSmall = (width) => {
  const [small, setSmall] = useState(window.innerWidth < width);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSmall(window.innerWidth < width);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return small;
};

export default useSmall;
