import { Dispatch, createContext, useReducer, ReactNode, useMemo } from "react";
import { DogDetailsReturnType } from "../types/DogDetailsTypes";

type AuthState = {
  isHamalUser: boolean | null;
  reports: DogDetailsReturnType[] | null;
};

type ContextProps = {
  state: AuthState;
  dispatch: Dispatch<any>;
};

export const AuthContext = createContext<ContextProps>({} as ContextProps);

type ProviderProps = {
  children: ReactNode;
};

type AuthAction =
  | { type: "SET_IS_HAMAL_USER"; payload: boolean }
  | { type: "SET_USER_REPORTS"; payload: DogDetailsReturnType[] | null }
  | { type: "ADD_NEW_REPORT"; payload: DogDetailsReturnType }
  | { type: "LOGOUT" };

const reducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "SET_IS_HAMAL_USER":
      return { isHamalUser: action.payload, reports: state?.reports ?? null };
    case "SET_USER_REPORTS":
      return {
        isHamalUser: state?.isHamalUser ?? null,
        reports: action.payload,
      };
    case "ADD_NEW_REPORT":
      return {
        isHamalUser: state?.isHamalUser ?? null,
        reports: state?.reports
          ? [...state.reports, action.payload]
          : [action.payload],
      };
    case "LOGOUT":
      return { isHamalUser: null, reports: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    isHamalUser: null,
    reports: null,
  });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
