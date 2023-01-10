import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { testIDs } from "./feedback.popup.identifiers";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIconContainer from "@src/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.style";
import externalLinks from "@src/config/external";
import useColour from "@src/hooks/ui/colour.hook";
import type { PopUpComponentProps } from "@src/vendors/types/integrations/ui.framework/popups/popups.component.types";

export default function FeedbackDialogue({
  message,
  onClose,
}: PopUpComponentProps) {
  const { feedbackColour } = useColour();

  return (
    <Box
      bg={feedbackColour.background}
      borderColor={feedbackColour.border}
      borderRadius={20}
      borderWidth={1}
      color={feedbackColour.foreground}
      data-testid={testIDs.FeedBackDialogue}
      mb={[5, 5, 8]}
    >
      <Flex align={"center"} justify={"center"} mt={2}>
        <ClickLink href={externalLinks.svsContact}>
          <DimOnHover ml={2} mb={2}>
            <Avatar
              data-testid={testIDs.FeedBackDialogueIcon}
              icon={<SVSIconContainer width={75} height={75} />}
              width={50}
            />
          </DimOnHover>
        </ClickLink>
        <Text ml={2} mb={2} mr={2} fontSize={["sm", "sm", "l"]}>
          {message}
        </Text>
        <DimOnHover pr={2}>
          <CloseIcon
            data-testid={testIDs.FeedBackDialogueCloseButton}
            mb={2}
            width={4}
            height={4}
            onClick={onClose}
          />
        </DimOnHover>
      </Flex>
    </Box>
  );
}
