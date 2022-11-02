import type { Dispatch, SetStateAction } from "react";

export interface ImagesControllerContextInterface {
  loadedCount: number;
  setLoadedCount: Dispatch<SetStateAction<number>>;
}
