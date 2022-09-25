import BodyComponent from "./inlays/about.body.component";
import FooterComponent from "./inlays/about.footer.component";
import ToggleComponent from "./inlays/about.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import useLocale from "@src/hooks/locale";

export default function About() {
  const { t } = useLocale("about");

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
