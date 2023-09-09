import { createContext, ReactNode, useState } from "react";
import InitialContext from "./images.initial";

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
