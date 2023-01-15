import { useState } from "react";
import type { SetStateAction, Dispatch } from "react";

const createLocalStorageState = (key: string) => {
  const useLocalStorageState = <LocalStorageType,>(
    initialValue: LocalStorageType
  ): [LocalStorageType, Dispatch<SetStateAction<LocalStorageType>>] => {
    const [storedValue, setStoredValue] = useState<LocalStorageType>(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    });

    const setValue = (
      value:
        | LocalStorageType
        | ((prevState: LocalStorageType) => LocalStorageType)
    ) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    };

    return [storedValue, setValue];
  };

  return useLocalStorageState as typeof useState;
};

export default createLocalStorageState;

export type LocalStorageStateHookType = ReturnType<
  typeof createLocalStorageState
>;
