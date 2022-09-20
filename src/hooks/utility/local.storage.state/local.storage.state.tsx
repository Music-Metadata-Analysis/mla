import { useState } from "react";
import type { SetStateAction, Dispatch } from "react";

const useLocalStorageState = <LocalStorageType,>(
  key: string,
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

export default useLocalStorageState;
