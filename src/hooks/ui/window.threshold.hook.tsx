import { useEffect } from "react";
import useToggle from "@src/utilities/react/hooks/toggle.hook";

export interface UseWindowThresholdInterface {
  axis: "innerHeight" | "innerWidth";
  lowState?: boolean;

  threshold: number;
}

function useWindowThreshold(props: UseWindowThresholdInterface) {
  const belowThresholdState = props.lowState ? props.lowState : false;

  const { setFalse, setTrue, state } = useToggle(belowThresholdState);

  const setterTable: { [key: string]: () => void } = {
    true: setTrue,
    false: setFalse,
  };

  const detectThreshold = () => {
    if (window[props.axis] >= props.threshold) {
      setterTable[String(!belowThresholdState)]();
    } else {
      setterTable[String(belowThresholdState)]();
    }
  };

  useEffect(() => {
    detectThreshold();
    window.addEventListener("resize", detectThreshold);
    return () => {
      window.removeEventListener("resize", detectThreshold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
  };
}

export default useWindowThreshold;

export type WindowThresholdHookType = ReturnType<typeof useWindowThreshold>;
