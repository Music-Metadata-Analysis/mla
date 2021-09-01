import { useContext } from "react";
import { settings } from "../config/navbar";
import { NavBarContext } from "../providers/navbar/navbar.provider";

const useNavBar = () => {
  const { setIsVisible } = useContext(NavBarContext);

  const hideNavBar = () => {
    if (window.innerHeight < settings.heightDuringInput) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const showNavBar = () => {
    setIsVisible(true);
  };

  return {
    hideNavBar,
    showNavBar,
  };
};

export default useNavBar;
