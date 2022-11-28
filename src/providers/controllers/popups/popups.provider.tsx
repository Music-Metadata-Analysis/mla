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
  const [state, dispatch] = useReducer(
    PopUpsControllerReducer,
    InitialContext.state
  );

  return (
    <PopUpsControllerContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </PopUpsControllerContext.Provider>
  );
};

export default PopUpsControllerProvider;
