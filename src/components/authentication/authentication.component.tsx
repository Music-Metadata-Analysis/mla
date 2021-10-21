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
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import useColours from "../../hooks/colour";

export const testIDs = {
  AuthenticationModalCloseButton: "AuthenticationCloseButton",
  AuthenticationModalTitle: "AuthenticationModalTitle",
  AuthenticationLoginButtons: "AuthenticationLoginButtons",
};

export interface AuthenticationProps {
  isOpen: boolean;
  onClose: () => void;
  signIn: (provider: string) => void;
}

export default function Authentication({
  isOpen,
  onClose,
  signIn,
}: AuthenticationProps) {
  const { t } = useTranslation("authentication");
  const buttonWidth = 250;
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
                  <FacebookLoginButton
                    style={{ width: buttonWidth }}
                    align={"center"}
                    onClick={() => signIn("facebook")}
                    text={t("buttons.facebook")}
                  />
                  <GithubLoginButton
                    style={{ width: buttonWidth }}
                    align={"center"}
                    onClick={() => signIn("github")}
                    text={t("buttons.github")}
                  />
                  <GoogleLoginButton
                    style={{ width: buttonWidth }}
                    align={"center"}
                    onClick={() => signIn("google")}
                    text={t("buttons.google")}
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
