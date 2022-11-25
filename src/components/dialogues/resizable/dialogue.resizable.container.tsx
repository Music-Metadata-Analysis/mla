import Dialogue from "./dialogue.resizable.component";
import dialogueSettings from "@src/config/dialogue";
import useRouter from "@src/hooks/router";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { DialogueInlayComponentType } from "@src/types/components/dialogue.types";

export interface DialogueContainerProps {
  BodyComponent?: DialogueInlayComponentType;
  FooterComponent?: DialogueInlayComponentType;
  HeaderComponent?: DialogueInlayComponentType;
  t: tFunctionType;
  titleText: string;
  ToggleComponent?: DialogueInlayComponentType;
}

export default function DialogueContainer({
  BodyComponent,
  FooterComponent,
  HeaderComponent,
  t,
  titleText,
  ToggleComponent,
}: DialogueContainerProps) {
  const router = useRouter();
  const toggle = useWindowThreshold({
    axis: "innerHeight",
    lowState: false,
    threshold: dialogueSettings.toggleMinimumDisplayHeight,
  });

  return (
    <Dialogue
      BodyComponent={BodyComponent}
      FooterComponent={FooterComponent}
      HeaderComponent={HeaderComponent}
      t={t}
      titleText={titleText}
      ToggleComponent={ToggleComponent}
      toggleState={toggle.state}
      router={router}
    />
  );
}
