import FooterComponent from "./inlays/privacy.footer.component";
import HeaderComponent from "./inlays/privacy.header.component";
import ToggleComponent from "./inlays/privacy.toggle.component";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import useLocale from "@src/hooks/locale";

export default function Privacy() {
  const { t } = useLocale("legal");

  return (
    <DialogueContainer
      FooterComponent={FooterComponent}
      HeaderComponent={HeaderComponent}
      t={t}
      titleText={t("privacy.title")}
      ToggleComponent={ToggleComponent}
    />
  );
}
