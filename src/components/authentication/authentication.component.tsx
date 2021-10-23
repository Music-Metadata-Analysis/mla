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
import AnalyticsWrapper from "../analytics/analytics.button/analytics.button.component";

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
                  <AnalyticsWrapper buttonName={"Facebook Login"}>
                    <FacebookLoginButton
                      style={{ width: buttonWidth }}
                      align={"center"}
                      onClick={() => signIn("facebook")}
                      text={t("buttons.facebook")}
                    />
                  </AnalyticsWrapper>
                  <AnalyticsWrapper buttonName={"Github Login"}>
                    <GithubLoginButton
                      style={{ width: buttonWidth }}
                      align={"center"}
                      onClick={() => signIn("github")}
                      text={t("buttons.github")}
                    />
                  </AnalyticsWrapper>
                  <AnalyticsWrapper buttonName={"Google Login"}>
                    <GoogleLoginButton
                      style={{ width: buttonWidth }}
                      align={"center"}
                      onClick={() => signIn("google")}
                      text={t("buttons.google")}
                    />
                  </AnalyticsWrapper>
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
