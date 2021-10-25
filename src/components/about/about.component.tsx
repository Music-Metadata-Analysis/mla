import { useTranslation } from "next-i18next";
import BodyComponent from "./inlays/about.body.component";
import FooterComponent from "./inlays/about.footer.component";
import ToggleComponent from "./inlays/about.toggle.component";
import Dialogue from "../dialogues/resizable/dialogue.resizable.component";

export default function About() {
  const { t } = useTranslation("about");

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
