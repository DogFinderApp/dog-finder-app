import { Dispatch, createContext, useReducer, ReactNode, useMemo } from "react";
import { DogDetailsReturnType } from "../types/DogDetailsTypes";
import { UserRole } from "../types/UserRole";

type AuthState = {
  role: UserRole;
  reports: DogDetailsReturnType[] | null;
  isFetchingReports: boolean;
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
  | { type: "SET_USER_ROLE"; payload: UserRole }
  | { type: "SET_USER_REPORTS"; payload: DogDetailsReturnType[] | null }
  | { type: "ADD_NEW_REPORT"; payload: DogDetailsReturnType }
  | { type: "SET_IS_FETCHING_REPORTS"; payload: boolean }
  | { type: "LOGOUT" };

const reducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "SET_USER_ROLE":
      return { ...state, role: action.payload };
    case "SET_USER_REPORTS":
      return { ...state, reports: action.payload };
    case "ADD_NEW_REPORT":
      return {
        ...state,
        reports: state?.reports
          ? [...state.reports, action.payload]
          : [action.payload],
      };
    case "SET_IS_FETCHING_REPORTS":
      return { ...state, isFetchingReports: action.payload };
    case "LOGOUT":
      return { role: null, reports: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  role: null,
  reports: null,
  isFetchingReports: false,
};

export const AuthContextProvider = ({ children }: ProviderProps) => {
  // @ts-expect-error
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
