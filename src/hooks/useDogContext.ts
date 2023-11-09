import { useContext } from "react";
import { DogContext } from "../context/DogContext";

export const useDogContext = () => {
  const context = useContext(DogContext);

  if (!context) {
    throw Error("useDogContext must be used inside an AuthContextProvider");
  }

  return context;
};
