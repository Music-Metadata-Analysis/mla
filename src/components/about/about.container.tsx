import BodyComponent from "./inlays/about.body.component";
import FooterComponent from "./inlays/about.footer.component";
import ToggleComponent from "./inlays/about.toggle.component";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import useLocale from "@src/hooks/locale.hook";

export default function AboutContainer() {
  const { t } = useLocale("about");

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
