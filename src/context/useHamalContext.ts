import { useContext } from "react";
import { HamalContext } from "./HamalContext";

export const useHamalContext = () => {
  const context = useContext(HamalContext);

  if (!context) {
    throw Error("useHamalContext must be used inside an AuthContextProvider");
  }

  return context;
};
