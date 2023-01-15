import { useState } from "react";
import useToggle from "@src/utilities/react/hooks/toggle.hook";

const useFlipCardController = () => {
  const drawer = useToggle(false);
  const [flippedCard, setFlippedCard] = useState<null | number>(null);

  const flip = (index: null | number) => {
    setFlippedCard(index);
    drawer.setTrue();
  };

  const closeDrawer = () => {
    flip(null);
    drawer.setFalse();
  };

  return {
    card: {
      state: flippedCard,
      flip,
    },
    drawer: {
      setFalse: closeDrawer,
      state: drawer.state,
    },
  };
};

export default useFlipCardController;

export type FlipCardControllerHookType = ReturnType<
  typeof useFlipCardController
>;
