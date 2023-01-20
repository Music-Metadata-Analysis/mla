import useWindowThresholdCallback from "@src/hooks/ui/window.threshold.callback.hook";
import useNavBar from "@src/web/navigation/navbar/state/controllers/navbar.controller.hook";

export interface UseNavBarThresholdToggleInterface {
  threshold: number;
}

const useNavBarThresholdToggle = ({
  threshold,
}: UseNavBarThresholdToggleInterface) => {
  const navbar = useNavBar();

  const onChange = (state: boolean) => {
    if (!state) {
      navbar.navigation.setFalse();
    } else {
      navbar.navigation.setTrue();
    }
  };

  const onUnmount = () => navbar.navigation.setTrue();

  useWindowThresholdCallback({
    axis: "innerHeight",
    onChange,
    onUnmount,
    threshold,
  });

  return null;
};

export default useNavBarThresholdToggle;

export type NavBarThresholdToggleType = ReturnType<
  typeof useNavBarThresholdToggle
>;
