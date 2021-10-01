import { createContext, useState } from "react";
import InitialValues from "./ui.images.initial";
import type { UserInterfaceImagesProviderInterface } from "../../../types/ui.types";

export const UserInterfaceImagesContext = createContext(InitialValues);

const UserInterfaceImagesProvider = ({
  children,
}: UserInterfaceImagesProviderInterface) => {
  const [loadedCount, setLoadedCount] = useState(0);

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
