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
import SignInButtons from "@src/components/authentication/buttons/signin.buttons";
import ClickLinkInternalContainer from "@src/components/clickable/click.link.internal/click.link.internal.container";
import VerticalScrollBar from "@src/components/scrollbar/vertical.scrollbar.component";
import routes from "@src/config/routes";
import useColours from "@src/hooks/colour";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { RefObject } from "react";

export const testIDs = {
  AuthenticationModalCloseButton: "AuthenticationCloseButton",
  AuthenticationModalFooter: "AuthenticationModalFooter",
  AuthenticationModalTitle: "AuthenticationModalTitle",
  AuthenticationLoginButtons: "AuthenticationLoginButtons",
};

export const ids = {
  SignInProvidersScrollArea: "SignInProvidersScrollArea",
};

export interface AuthenticationSignInModalProps {
  authenticationT: tFunctionType;
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
  scrollRef: RefObject<HTMLDivElement>;
  setClicked: (value: boolean) => void;
  signIn: (provider: AuthServiceType) => void;
  termsText: string;
  titleText: string;
}

export default function AuthenticationSignInModal({
  authenticationT,
  isOpen,
  onClose,
  scrollRef,
  setClicked,
  signIn,
  termsText,
  titleText,
}: AuthenticationSignInModalProps) {
  const { modalColour } = useColours();

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
              {titleText}
            </ModalHeader>
          </Container>
          <ModalBody pl={2} pr={2}>
            <Center>
              <Box
                maxHeight={"calc(100vh - 150px)"}
                className={"scrollbar"}
                ref={scrollRef}
                id={ids.SignInProvidersScrollArea}
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
                    t={authenticationT}
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
              <ClickLinkInternalContainer path={routes.legal.terms}>
                {termsText}
              </ClickLinkInternalContainer>
            </Flex>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
