import { useContext } from "react";
import NavConfig from "../config/navbar";
import { NavBarContext } from "../providers/navbar/navbar.provider";

const useNavBar = () => {
  const { setters, getters } = useContext(NavBarContext);

  const disableHamburger = () => {
    setters.setIsHamburgerEnabled(false);
  };

  const enableHamburger = () => {
    setters.setIsHamburgerEnabled(true);
  };

  const hideNavBar = () => {
    if (window.innerHeight < NavConfig.heightDuringInput) {
      setters.setIsVisible(false);
    } else {
      setters.setIsVisible(true);
    }
  };

  const showNavBar = () => {
    setters.setIsVisible(true);
  };

  return {
    getters: {
      isHamburgerEnabled: getters.isHamburgerEnabled,
      isVisible: getters.isVisible,
    },
    setters: {
      hideNavBar,
      showNavBar,
      disableHamburger,
      enableHamburger,
    },
  };
};

export default useNavBar;
