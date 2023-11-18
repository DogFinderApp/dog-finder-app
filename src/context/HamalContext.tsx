import { Dispatch, createContext, useReducer, ReactNode, useMemo } from "react";

type HamalState = { isHamalUser: boolean };

type ContextProps = {
  state: HamalState;
  dispatch: Dispatch<any>;
};

export const HamalContext = createContext<ContextProps>({} as ContextProps);

type ProviderProps = {
  children: ReactNode;
};

type HamalAction = { type: "SET_IS_HAMAL_USER"; payload: boolean };

const reducer = (state: HamalState, action: HamalAction) => {
  switch (action.type) {
    case "SET_IS_HAMAL_USER":
      return { isHamalUser: action.payload };
    default:
      return state;
  }
};

export const HamalContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { isHamalUser: false });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <HamalContext.Provider value={value}>{children}</HamalContext.Provider>
  );
};
