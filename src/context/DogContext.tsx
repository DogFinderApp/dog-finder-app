import { Dispatch, createContext, useReducer, ReactNode, useMemo } from "react";

type DogIdState = { lastReportedDogId: number | null };

type ContextProps = {
  state: DogIdState;
  dispatch: Dispatch<any>;
};

export const DogContext = createContext<ContextProps>({} as ContextProps);

type ProviderProps = {
  children: ReactNode;
};

type DogAction =
  | { type: "SAVE_DOG_ID"; payload: number }
  | { type: "DELETE_DOG_ID" };

const reducer = (state: DogIdState, action: DogAction) => {
  switch (action.type) {
    case "SAVE_DOG_ID":
      return { lastReportedDogId: action.payload };
    case "DELETE_DOG_ID":
      return { lastReportedDogId: null };
    default:
      return state;
  }
};

export const DogContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { lastReportedDogId: null });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
};
