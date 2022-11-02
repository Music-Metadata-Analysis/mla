import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIcon from "@src/components/icons/svs/svs.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import externalLinks from "@src/config/external";
import useColour from "@src/hooks/colour";
import type { PopUpComponentProps } from "@src/types/controllers/popups/component.popups.types";

export const testIDs = {
  FeedBackDialogueCloseButton: "FeedBackDialogueCloseButton",
  FeedBackDialogueIcon: "FeedBackDialogueIcon",
};

export default function FeedbackDialogue({
  message,
  onClose,
}: PopUpComponentProps) {
  const { feedbackColour } = useColour();

  return (
    <Box
      mb={[5, 5, 8]}
      bg={feedbackColour.background}
      color={feedbackColour.foreground}
      borderColor={feedbackColour.border}
      borderWidth={1}
      borderRadius={20}
    >
      <Flex align={"center"} justify={"center"} mt={2}>
        <ClickLink href={externalLinks.svsContact}>
          <DimOnHover ml={2} mb={2}>
            <Avatar
              data-testid={testIDs.FeedBackDialogueIcon}
              icon={<SVSIcon width={75} height={75} />}
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
