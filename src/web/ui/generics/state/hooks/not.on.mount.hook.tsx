import { useEffect, useRef } from "react";

const useNotOnMountEffect = (func: () => void, deps: unknown[]) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      func();
    } else {
      isMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useNotOnMountEffect;

export type NotOnMountEffectHooKType = ReturnType<typeof useNotOnMountEffect>;
