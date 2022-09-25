import FooterComponent from "./inlays/privacy.footer.component";
import HeaderComponent from "./inlays/privacy.header.component";
import ToggleComponent from "./inlays/privacy.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import useLocale from "@src/hooks/locale";

export default function Privacy() {
  const { t } = useLocale("legal");

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
