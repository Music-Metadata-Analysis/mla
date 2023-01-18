import { createContext, ReactNode, useReducer } from "react";
import { InitialContext } from "./popups.initial";
import { PopUpsControllerReducer } from "./popups.reducer";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { PopUpComponentNameType } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

interface PopUpsControllerProviderProps {
  children: ReactNode;
  popUps: Array<PopUpComponentNameType>;
}

export const PopUpsControllerContext = createContext(InitialContext);

const PopUpsControllerProvider = ({
  children,
  popUps,
}: PopUpsControllerProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(
    PopUpsControllerReducer,
    InitialContext.state
  );

  if (Object.keys(state).length === 0 && !webFrameworkVendor.isSSR()) {
    popUps.forEach((name) => dispatch({ type: "RegisterPopUp", name }));
  }

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
