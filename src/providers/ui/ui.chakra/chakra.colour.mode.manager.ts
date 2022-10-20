import { cookieStorageManager, localStorageManager } from "@chakra-ui/react";
import type { ColorMode } from "@chakra-ui/react";

const createColourModeManager = (
  cookies: string | { [key: string]: string },
  initialMode: ColorMode
) => {
  if (typeof cookies !== "string") return localStorageManager;

  localStorageManager.set(localStorageManager.get(initialMode) as ColorMode);
  const cookieManager = cookieStorageManager(cookies);

  return {
    get: cookieManager.get,
    set: (value: ColorMode) => {
      localStorageManager.set(value);
      return cookieManager.set(value);
    },
    type: cookieManager.type,
  };
};

export default createColourModeManager;
