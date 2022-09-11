import { Flex } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import dialogueSettings from "../../../config/dialogue";
import Billboard from "../../billboard/billboard.component";
import Condition from "../../condition/condition.component";
import type { TFunction } from "next-i18next";

export const testIDs = {
  DialogueHeaderComponent: "DialogueHeaderComponent",
  DialogueBodyComponent: "DialogueBodyComponent",
  DialogueToggleComponent: "DialogueToggleComponent",
  DialogueFooterComponent: "DialogueFooterComponent",
};

export interface DialogueProps {
  FooterComponent: FC<{ t: TFunction }>;
  t: TFunction;
  titleKey: string;
  BodyComponent: FC<{ t: TFunction }>;
  HeaderComponent: FC<{ t: TFunction }>;
  ToggleComponent: FC<{ t: TFunction }>;
}

export default function Dialogue({
  t,
  titleKey,
  BodyComponent,
  FooterComponent,
  HeaderComponent,
  ToggleComponent,
}: DialogueProps) {
  const [visible, setVisible] = useState(true);

  const recalculateHeight = () => {
    if (window.innerHeight < dialogueSettings.toggleMinimumDisplayHeight) {
      setVisible(false);
    } else {
      setVisible(true);
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
    <Billboard title={t(titleKey)}>
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <div data-testid={testIDs.DialogueHeaderComponent}>
          <HeaderComponent t={t} />
        </div>
        <Condition isTrue={visible}>
          <div data-testid={testIDs.DialogueToggleComponent}>
            <ToggleComponent t={t} />
          </div>
        </Condition>
        <div data-testid={testIDs.DialogueBodyComponent}>
          <BodyComponent t={t} />
        </div>
        <div data-testid={testIDs.DialogueFooterComponent}>
          <FooterComponent t={t} />
        </div>
      </Flex>
    </Billboard>
  );
}
