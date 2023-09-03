import BodyComponent from "./inlays/splash.body.component";
import FooterComponent from "./inlays/splash.footer.component";
import ToggleComponent from "./inlays/splash.toggle.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import DialogueContainer from "@src/web/ui/generics/components/dialogues/resizable/dialogue.resizable.container";

export default function Splash() {
  const { t } = useTranslation("splash");

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
