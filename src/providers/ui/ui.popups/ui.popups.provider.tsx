import { createContext, ReactNode, useReducer } from "react";
import InitialContext from "./ui.popups.initial";
import { UserInterfacePopUpsReducer } from "./ui.popups.reducer";

export const UserInterfacePopUpsContext = createContext({ ...InitialContext });

interface UserInterfacePopUpsProviderProps {
  children: ReactNode;
}

const UserInterfacePopUpsProvider = ({
  children,
}: UserInterfacePopUpsProviderProps) => {
  const [status, dispatch] = useReducer(
    UserInterfacePopUpsReducer,
    InitialContext.status
  );

  return (
    <UserInterfacePopUpsContext.Provider
      value={{
        status,
        dispatch,
      }}
    >
      {children}
    </UserInterfacePopUpsContext.Provider>
  );
};

export default UserInterfacePopUpsProvider;
