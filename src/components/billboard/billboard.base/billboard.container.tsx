import BillBoard from "./billboard.component";
import { settings } from "@src/config/billboard";
import useNavBarController from "@src/hooks/controllers/navbar.controller.hook";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";

interface BillboardContainerProps {
  children: JSX.Element | JSX.Element[];

  titleText: string;
}

const BillboardContainer = ({
  children,
  titleText,
}: BillboardContainerProps) => {
  const { navigation } = useNavBarController();
  const threshold = useWindowThreshold({
    axis: "innerHeight",
    lowState: false,
    threshold: settings.minimumTitleHeight,
  });

  return (
    <BillBoard
      isNavBarVisible={navigation.state}
      showTitle={threshold.state}
      titleText={titleText}
    >
      {children}
    </BillBoard>
  );
};

export default BillboardContainer;
