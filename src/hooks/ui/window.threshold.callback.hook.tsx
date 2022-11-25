import { useEffect } from "react";
import useWindowThreshold from "./window.threshold.hook";

export interface UseWindowThresholdCallbackInterface {
  axis: "innerHeight" | "innerWidth";
  onChange: (thresholdState: boolean) => void;
  onUnmount: () => void;
  threshold: number;
}

function useWindowThresholdCallback(
  props: UseWindowThresholdCallbackInterface
) {
  const windowThreshold = useWindowThreshold({
    axis: props.axis,
    lowState: false,
    threshold: props.threshold,
  });

  useEffect(() => {
    props.onChange(windowThreshold.state);
    return () => {
      props.onUnmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowThreshold.state]);

  return { state: windowThreshold.state };
}

export default useWindowThresholdCallback;

export type WindowThresholdCallbackHookType = ReturnType<
  typeof useWindowThresholdCallback
>;
