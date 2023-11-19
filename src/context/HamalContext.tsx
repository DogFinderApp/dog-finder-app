import { Dispatch, createContext, useReducer, ReactNode, useMemo } from "react";

type HamalState = { isHamalUser: boolean | null };

type ContextProps = {
  state: HamalState;
  dispatch: Dispatch<any>;
};

export const HamalContext = createContext<ContextProps>({} as ContextProps);

type ProviderProps = {
  children: ReactNode;
};

type HamalAction =
  | { type: "SET_IS_HAMAL_USER"; payload: boolean }
  | { type: "REMOVE_HAMAL_USER" };

const reducer = (state: HamalState, action: HamalAction) => {
  switch (action.type) {
    case "SET_IS_HAMAL_USER":
      return { isHamalUser: action.payload };
    case "REMOVE_HAMAL_USER":
      return { isHamalUser: null };
    default:
      return state;
  }
};

export const HamalContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { isHamalUser: null });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <HamalContext.Provider value={value}>{children}</HamalContext.Provider>
  );
};
