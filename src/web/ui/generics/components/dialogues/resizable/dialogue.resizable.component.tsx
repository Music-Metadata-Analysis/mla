/* eslint-disable react-hooks/static-components */
import { Box, Flex } from "@chakra-ui/react";
import { testIDs } from "./dialogue.resizable.identifiers";
import BillboardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";
import Condition from "@src/web/ui/generics/components/condition/condition.component";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { RouterHookType } from "@src/web/navigation/routing/hooks/router.hook";
import type { DialogueInlayComponentType } from "@src/web/ui/generics/types/components/dialogue.types";

export interface DialogueProps {
  BodyComponent?: DialogueInlayComponentType;
  FooterComponent?: DialogueInlayComponentType;
  HeaderComponent?: DialogueInlayComponentType;
  router: RouterHookType;
  t: tFunctionType;
  titleText: string;
  ToggleComponent?: DialogueInlayComponentType;
  toggleState: boolean;
}

export default function Dialogue({
  BodyComponent,
  FooterComponent,
  HeaderComponent,
  t,
  titleText,
  ToggleComponent,
  toggleState,
  router,
}: DialogueProps) {
  const OptionalComponent = (props: {
    component?: DialogueInlayComponentType;
    id: string;
  }) => {
    if (!props.component) return null;
    return (
      <Box data-testid={props.id}>
        <props.component t={t} router={router} />
      </Box>
    );
  };

  return (
    <BillboardContainer titleText={titleText}>
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <OptionalComponent
          component={HeaderComponent}
          id={testIDs.DialogueHeaderComponent}
        />
        <Condition isTrue={toggleState}>
          <OptionalComponent
            component={ToggleComponent}
            id={testIDs.DialogueToggleComponent}
          />
        </Condition>
        <OptionalComponent
          component={BodyComponent}
          id={testIDs.DialogueBodyComponent}
        />
        <OptionalComponent
          component={FooterComponent}
          id={testIDs.DialogueFooterComponent}
        />
      </Flex>
    </BillboardContainer>
  );
}
