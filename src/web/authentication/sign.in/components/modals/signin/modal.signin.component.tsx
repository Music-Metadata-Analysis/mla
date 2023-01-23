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
import { testIDs, ids } from "./modal.signin.identifiers";
import ClickLinkInternalContainer from "@src/components/clickable/click.link.internal/click.link.internal.container";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import routes from "@src/config/routes";
import useColours from "@src/hooks/ui/colour.hook";
import SignInButtons from "@src/web/authentication/sign.in/components/buttons/signin.buttons.component";
import type { AuthVendorServiceType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { RefObject } from "react";

export interface AuthenticationSignInModalProps {
  authenticationT: tFunctionType;
  handleSignIn: (provider: AuthVendorServiceType) => void;
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
  scrollRef: RefObject<HTMLDivElement>;
  termsText: string;
  titleText: string;
}

export default function AuthenticationSignInModal({
  authenticationT,
  handleSignIn,
  isOpen,
  onClose,
  scrollRef,
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
                <VerticalScrollBarContainer
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
                    handleSignIn={handleSignIn}
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
