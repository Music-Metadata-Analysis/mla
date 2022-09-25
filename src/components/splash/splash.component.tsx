import BodyComponent from "./inlays/splash.body.component";
import FooterComponent from "./inlays/splash.footer.component";
import ToggleComponent from "./inlays/splash.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import useLocale from "@src/hooks/locale";

export default function Splash() {
  const { t } = useLocale("splash");

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
