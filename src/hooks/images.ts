import { useContext } from "react";
import { ImagesControllerContext } from "@src/providers/controllers/images/images.provider";

const useImagesController = () => {
  const images = useContext(ImagesControllerContext);

  return {
    count: images.loadedCount,
    load: () => images.setLoadedCount((prevState) => prevState + 1),
    reset: () => images.setLoadedCount(0),
  };
};

export default useImagesController;
