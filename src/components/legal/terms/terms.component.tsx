import { useTranslation } from "next-i18next";
import FooterComponent from "./inlays/terms.footer.component";
import HeaderComponent from "./inlays/terms.header.component";
import ToggleComponent from "./inlays/terms.toggle.component";
import Dialogue from "../../dialogues/resizable/dialogue.resizable.component";

export default function TermsOfService() {
  const { t } = useTranslation("legal");

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
