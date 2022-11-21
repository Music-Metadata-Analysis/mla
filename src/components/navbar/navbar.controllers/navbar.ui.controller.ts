import { useEffect, useRef } from "react";
import useNavBar from "@src/hooks/navbar";

const useNavBarController = () => {
  const controls = useNavBar();
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

export default useNavBarController;

export type NavBarControllerHookType = ReturnType<typeof useNavBarController>;
