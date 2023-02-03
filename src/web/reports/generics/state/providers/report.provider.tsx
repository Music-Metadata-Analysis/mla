import React, { useReducer, createContext } from "react";
import InitialValues from "./report.initial";
import { UserReducer } from "./report.reducer";

export const UserContext = createContext({ ...InitialValues });

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [userProperties, dispatch] = useReducer(
    UserReducer,
    InitialValues.userProperties
  );

  return (
    <UserContext.Provider
      value={{
        userProperties,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
