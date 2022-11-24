import BillBoard from "./billboard.component";
import { settings } from "@src/config/billboard";
import useNavBar from "@src/hooks/navbar";
import useWindowThreshold from "@src/hooks/utility/windowThreshold";

interface BillboardContainerProps {
  children: JSX.Element | JSX.Element[];

  titleText: string;
}

const BillboardContainer = ({
  children,
  titleText,
}: BillboardContainerProps) => {
  const { navigation } = useNavBar();
  const threshold = useWindowThreshold({
    lowState: false,
    axis: "innerHeight",
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
