import { useContext } from "react";
import NavConfig from "@src/config/navbar";
import { NavBarControllerContext } from "@src/providers/controllers/navbar/navbar.provider";

const useNavBar = () => {
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

export default useNavBar;

export type NavBarHookType = ReturnType<typeof useNavBar>;
