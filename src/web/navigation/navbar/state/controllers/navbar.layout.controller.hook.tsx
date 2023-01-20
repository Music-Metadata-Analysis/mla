import { useEffect, useRef } from "react";
import useNavBarController from "@src/web/navigation/navbar/state/controllers/navbar.controller.hook";

const useNavBarLayoutController = () => {
  const controls = useNavBarController();
  const rootReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", focusChangeHandler);
    return () => document.removeEventListener("click", focusChangeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusChangeHandler = (event: MouseEvent) => {
    if (rootReference.current?.clientHeight) {
      if (event.clientY > rootReference.current?.clientHeight)
        controls.mobileMenu.setFalse();
    }
  };

  return {
    controls,
    rootReference,
  };
};

export default useNavBarLayoutController;

export type NavBarControllerHookType = ReturnType<
  typeof useNavBarLayoutController
>;
