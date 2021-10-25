import { useTranslation } from "next-i18next";
import BodyComponent from "./inlays/splash.body.component";
import FooterComponent from "./inlays/splash.footer.component";
import ToggleComponent from "./inlays/splash.toggle.component";
import Dialogue from "../dialogues/resizable/dialogue.resizable.component";

export default function Splash() {
  const { t } = useTranslation("splash");

  return (
    <Dialogue
      t={t}
      titleKey={"title"}
      HeaderComponent={() => <></>}
      ToggleComponent={ToggleComponent}
      BodyComponent={BodyComponent}
      FooterComponent={FooterComponent}
    />
  );
}
