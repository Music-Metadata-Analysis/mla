import { useCallback, useState } from "react";

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const setFalse = () => {
    setState(false);
  };

  const setTrue = () => {
    setState(true);
  };

  const toggle = useCallback(() => {
    if (state) {
      setFalse();
    } else {
      setTrue();
    }
  }, [state]);

  return {
    state,
    setFalse,
    setTrue,
    toggle,
  };
}

export default useToggle;

export type ToggleHookType = ReturnType<typeof useToggle>;
