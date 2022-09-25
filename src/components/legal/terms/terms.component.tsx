import FooterComponent from "./inlays/terms.footer.component";
import HeaderComponent from "./inlays/terms.header.component";
import ToggleComponent from "./inlays/terms.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import useLocale from "@src/hooks/locale";

export default function TermsOfService() {
  const { t } = useLocale("legal");

  return (
    <Dialogue
      t={t}
      titleKey={"termsOfService.title"}
      HeaderComponent={HeaderComponent}
      ToggleComponent={ToggleComponent}
      BodyComponent={() => <></>}
      FooterComponent={FooterComponent}
    />
  );
}
