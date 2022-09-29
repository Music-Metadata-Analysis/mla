import {
  Box,
  Center,
  Container,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRef } from "react";
import SignInButtons from "../buttons/signin.buttons";
import ClickLink from "@src/components/clickable/click.link.internal/click.link.internal.component";
import VerticalScrollBar from "@src/components/scrollbar/vertical.scrollbar.component";
import routes from "@src/config/routes";
import useColours from "@src/hooks/colour";
import useLocale from "@src/hooks/locale";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";

export const testIDs = {
  AuthenticationModalCloseButton: "AuthenticationCloseButton",
  AuthenticationModalFooter: "AuthenticationModalFooter",
  AuthenticationModalTitle: "AuthenticationModalTitle",
  AuthenticationLoginButtons: "AuthenticationLoginButtons",
};

export interface AuthenticationProps {
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
  setClicked: (value: boolean) => void;
  signIn: (provider: AuthServiceType) => void;
}

export default function ModalComponent({
  isOpen,
  onClose,
  setClicked,
  signIn,
}: AuthenticationProps) {
  const { t } = useLocale("authentication");
  const { modalColour } = useColours();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        bg={modalColour.background}
        borderColor={modalColour.border}
        color={modalColour.foreground}
        m={0}
        ml={2}
        mr={2}
      >
        <ModalCloseButton
          data-testid={testIDs.AuthenticationModalCloseButton}
          sx={{
            boxShadow: "none !important",
          }}
        />
        <Box borderWidth={1}>
          <Container centerContent={true}>
            <ModalHeader data-testid={testIDs.AuthenticationModalTitle}>
              {t("title")}
            </ModalHeader>
          </Container>
          <ModalBody pl={2} pr={2}>
            <Center>
              <Box
                maxHeight={"calc(100vh - 150px)"}
                className={"scrollbar"}
                ref={scrollRef}
                id={"SignInProvidersScrollArea"}
              >
                <VerticalScrollBar
                  scrollRef={scrollRef}
                  update={null}
                  horizontalOffset={10}
                  verticalOffset={0}
                  zIndex={10000}
                />
                <Flex
                  direction={"column"}
                  data-testid={testIDs.AuthenticationLoginButtons}
                >
                  <SignInButtons
                    t={t}
                    signIn={signIn}
                    setClicked={setClicked}
                  />
                </Flex>
              </Box>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Flex
              data-testid={testIDs.AuthenticationModalFooter}
              textDecoration={"underline"}
              justify={"center"}
              align={"center"}
              w={"100%"}
              onClick={() => onClose(true)}
            >
              <ClickLink path={routes.legal.terms}>{t("terms")}</ClickLink>
            </Flex>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
