import { useContext } from "react";
import NavConfig from "@src/config/navbar";
import { NavBarContext } from "@src/providers/navbar/navbar.provider";

const useNavBar = () => {
  const context = useContext(NavBarContext);

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
