import BodyComponent from "./inlays/splash.body.component";
import FooterComponent from "./inlays/splash.footer.component";
import ToggleComponent from "./inlays/splash.toggle.component";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import useLocale from "@src/hooks/locale";

export default function Splash() {
  const { t } = useLocale("splash");

  return (
    <DialogueContainer
      BodyComponent={BodyComponent}
      FooterComponent={FooterComponent}
      t={t}
      titleText={t("title")}
      ToggleComponent={ToggleComponent}
    />
  );
}
