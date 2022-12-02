import { cookieStorageManager, localStorageManager } from "@chakra-ui/react";
import type { ColorMode } from "@chakra-ui/react";

const createColourModeManager = (
  cookies: string | { [key: string]: string },
  initialMode: ColorMode
) => {
  let cookieManager: ReturnType<typeof cookieStorageManager>;
  let readManager:
    | ReturnType<typeof cookieStorageManager>
    | typeof localStorageManager;

  if (typeof cookies === "string") {
    cookieManager = cookieStorageManager(cookies);
    readManager = cookieManager;
    localStorageManager.set(localStorageManager.get(initialMode) as ColorMode);
  } else {
    cookieManager = cookieStorageManager("");
    readManager = localStorageManager;
  }

  return {
    get: readManager.get,
    set: (value: ColorMode) => {
      localStorageManager.set(value);
      cookieManager.set(value);
    },
    type: readManager.type,
  };
};

export default createColourModeManager;
