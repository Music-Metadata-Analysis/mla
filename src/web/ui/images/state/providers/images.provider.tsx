import { createContext, useState } from "react";
import InitialContext from "./images.initial";
import type { ReactNode } from "react";

export const ImagesControllerContext = createContext(InitialContext);

interface UserInterfaceImagesProviderInterface {
  children: ReactNode;
}

const ImagesControllerProvider = ({
  children,
}: UserInterfaceImagesProviderInterface) => {
  const [loadedCount, setLoadedCount] = useState(InitialContext.loadedCount);

  return (
    <ImagesControllerContext.Provider
      value={{
        loadedCount,
        setLoadedCount,
      }}
    >
      {children}
    </ImagesControllerContext.Provider>
  );
};

export default ImagesControllerProvider;
