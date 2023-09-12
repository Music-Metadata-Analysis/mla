import Search from "./search.component";
import navbarSettings from "@src/config/navbar";
import useNavBarThresholdToggle from "@src/web/navigation/navbar/state/controllers/navbar.threshold.toggle.hook";

interface SearchContainerProps {
  route: string;
  titleText: string;
}

export default function SearchContainer({
  route,
  titleText,
}: SearchContainerProps) {
  useNavBarThresholdToggle({
    threshold: navbarSettings.minimumHeightDuringInput,
  });

  return <Search route={route} titleText={titleText} />;
}
