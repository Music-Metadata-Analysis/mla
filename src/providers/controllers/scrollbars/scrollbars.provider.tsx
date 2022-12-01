import { createContext, ReactNode, useState } from "react";
import InitialContext from "./scrollbars.initial";

export const ScrollBarsControllerContext = createContext({ ...InitialContext });

interface ScrollBarsControllerProviderProps {
  children: ReactNode;
}

const ScrollBarsProvider = ({
  children,
}: ScrollBarsControllerProviderProps) => {
  const [stack, setStack] = useState(InitialContext.stack);

  return (
    <ScrollBarsControllerContext.Provider
      value={{
        stack,
        setStack,
      }}
    >
      {children}
    </ScrollBarsControllerContext.Provider>
  );
};

export default ScrollBarsProvider;
