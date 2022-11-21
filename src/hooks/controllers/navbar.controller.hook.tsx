import { useContext } from "react";
import NavConfig from "@src/config/navbar";
import { NavBarControllerContext } from "@src/providers/controllers/navbar/navbar.provider";

const useNavBarController = () => {
  const context = useContext(NavBarControllerContext);

  const limitedNavBarHide = () => {
    if (window.innerHeight < NavConfig.minimumHeightDuringInput) {
      context.navigation.setFalse();
    } else {
      context.navigation.setTrue();
    }
  };

  return {
    ...context,
    navigation: {
      ...context.navigation,
      setFalse: limitedNavBarHide,
    },
  };
};

export default useNavBarController;

export type NavBarControllerHookType = ReturnType<typeof useNavBarController>;
