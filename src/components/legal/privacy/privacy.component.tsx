import { useTranslation } from "next-i18next";
import FooterComponent from "./inlays/privacy.footer.component";
import HeaderComponent from "./inlays/privacy.header.component";
import ToggleComponent from "./inlays/privacy.toggle.component";
import Dialogue from "../../dialogues/resizable/dialogue.resizable.component";

export default function Privacy() {
  const { t } = useTranslation("legal");

  return (
    <Dialogue
      t={t}
      titleKey={"privacy.title"}
      HeaderComponent={HeaderComponent}
      ToggleComponent={ToggleComponent}
      BodyComponent={() => <></>}
      FooterComponent={FooterComponent}
    />
  );
}
