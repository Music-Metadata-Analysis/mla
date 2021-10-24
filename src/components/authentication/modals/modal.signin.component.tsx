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
import { useTranslation } from "next-i18next";
import useColours from "../../../hooks/colour";
import SignInButtons from "../buttons/signin.buttons";

export const testIDs = {
  AuthenticationModalCloseButton: "AuthenticationCloseButton",
  AuthenticationModalTitle: "AuthenticationModalTitle",
  AuthenticationLoginButtons: "AuthenticationLoginButtons",
};

export interface AuthenticationProps {
  isOpen: boolean;
  onClose: () => void;
  setClicked: (value: boolean) => void;
  signIn: (provider: string) => void;
}

export default function ModalComponent({
  isOpen,
  onClose,
  setClicked,
  signIn,
}: AuthenticationProps) {
  const { t } = useTranslation("authentication");
  const { modalColour } = useColours();

  return (
    <>
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
            <ModalBody>
              <Center>
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
              </Center>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
