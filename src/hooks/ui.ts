import { useContext } from "react";
import { UserInterfaceImagesContext } from "../providers/ui/ui.images/ui.images.provider";

const useUserInterface = () => {
  const { loadedCount, setLoadedCount } = useContext(
    UserInterfaceImagesContext
  );

  const reset = () => {
    setLoadedCount(0);
  };

  const load = () => {
    setLoadedCount((prevState) => prevState + 1);
  };

  return {
    count: loadedCount,
    load,
    reset,
  };
};

export default useUserInterface;
