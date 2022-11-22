import { useEffect } from "react";
import Dialogue from "./dialogue.resizable.component";
import dialogueSettings from "@src/config/dialogue";
import useRouter from "@src/hooks/router";
import useToggle from "@src/hooks/utility/toggle";
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
  const { setFalse, setTrue, state } = useToggle(true);
  const router = useRouter();

  const recalculateHeight = () => {
    if (window.innerHeight < dialogueSettings.toggleMinimumDisplayHeight) {
      setFalse();
    } else {
      setTrue();
    }
  };

  useEffect(() => {
    recalculateHeight();
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialogue
      BodyComponent={BodyComponent}
      FooterComponent={FooterComponent}
      HeaderComponent={HeaderComponent}
      t={t}
      titleText={titleText}
      ToggleComponent={ToggleComponent}
      toggleState={state}
      router={router}
    />
  );
}
