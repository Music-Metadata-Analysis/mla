import type { Dispatch, SetStateAction } from "react";

export interface UserInterfaceImagesContextInterface {
  loadedCount: number;
  setLoadedCount: Dispatch<SetStateAction<number>>;
}

export interface UserInterfaceImagesProviderInterface {
  children: React.ReactNode;
}
