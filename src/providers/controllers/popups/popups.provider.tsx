import { createContext, ReactNode, useReducer } from "react";
import InitialContext from "./popups.initial";
import { PopUpsControllerReducer } from "./popups.reducer";

export const PopUpsControllerContext = createContext({ ...InitialContext });

interface PopUpsControllerProviderProps {
  children: ReactNode;
}

const PopUpsControllerProvider = ({
  children,
}: PopUpsControllerProviderProps) => {
  const [status, dispatch] = useReducer(
    PopUpsControllerReducer,
    InitialContext.status
  );

  return (
    <PopUpsControllerContext.Provider
      value={{
        status,
        dispatch,
      }}
    >
      {children}
    </PopUpsControllerContext.Provider>
  );
};

export default PopUpsControllerProvider;
