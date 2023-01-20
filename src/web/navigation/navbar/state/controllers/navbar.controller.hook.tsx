import { useContext } from "react";
import { NavBarControllerContext } from "@src/web/navigation/navbar/state/providers/navbar.provider";

const useNavBarController = () => {
  const context = useContext(NavBarControllerContext);

  return {
    ...context,
  };
};

export default useNavBarController;

export type NavBarControllerHookType = ReturnType<typeof useNavBarController>;
