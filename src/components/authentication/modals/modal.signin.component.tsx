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
import routes from "../../../config/routes";
import useColours from "../../../hooks/colour";
import ClickLink from "../../clickable/click.link.internal/click.link.internal.component";
import SignInButtons from "../buttons/signin.buttons";

export const testIDs = {
  AuthenticationModalCloseButton: "AuthenticationCloseButton",
  AuthenticationModalFooter: "AuthenticationModalFooter",
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
            <ModalFooter>
              <Flex
                data-testid={testIDs.AuthenticationModalFooter}
                textDecoration={"underline"}
                justify={"center"}
                align={"center"}
                w={"100%"}
                onClick={onClose}
              >
                <ClickLink href={routes.legal.terms}>{t("terms")}</ClickLink>
              </Flex>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
