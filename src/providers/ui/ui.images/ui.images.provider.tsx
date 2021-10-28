import { createContext, ReactNode, useState } from "react";
import InitialContext from "./ui.images.initial";

export const UserInterfaceImagesContext = createContext(InitialContext);

interface UserInterfaceImagesProviderInterface {
  children: ReactNode;
}

const UserInterfaceImagesProvider = ({
  children,
}: UserInterfaceImagesProviderInterface) => {
  const [loadedCount, setLoadedCount] = useState(InitialContext.loadedCount);

  return (
    <UserInterfaceImagesContext.Provider
      value={{
        loadedCount,
        setLoadedCount,
      }}
    >
      {children}
    </UserInterfaceImagesContext.Provider>
  );
};

export default UserInterfaceImagesProvider;
