import { Flex } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import Billboard from "@src/components/billboard/billboard.component";
import Condition from "@src/components/condition/condition.component";
import dialogueSettings from "@src/config/dialogue";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export const testIDs = {
  DialogueHeaderComponent: "DialogueHeaderComponent",
  DialogueBodyComponent: "DialogueBodyComponent",
  DialogueToggleComponent: "DialogueToggleComponent",
  DialogueFooterComponent: "DialogueFooterComponent",
};

export interface DialogueProps {
  FooterComponent: FC<{ t: tFunctionType }>;
  t: tFunctionType;
  titleKey: string;
  BodyComponent: FC<{ t: tFunctionType }>;
  HeaderComponent: FC<{ t: tFunctionType }>;
  ToggleComponent: FC<{ t: tFunctionType }>;
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
