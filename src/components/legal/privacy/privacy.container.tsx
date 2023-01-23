import FooterComponent from "./inlays/privacy.footer.component";
import HeaderComponent from "./inlays/privacy.header.component";
import ToggleComponent from "./inlays/privacy.toggle.component";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export default function Privacy() {
  const { t } = useTranslation("legal");

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
