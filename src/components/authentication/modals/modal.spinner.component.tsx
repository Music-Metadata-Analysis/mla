import {
  Box,
  Center,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import useColours from "../../../hooks/colour";

export const testIDs = {
  AuthenticationSpinnerModalTitle: "AuthenticationSpinnerModalTitle",
  AuthenticationSpinnerModalSpinner: "AuthenticationSpinnerModalSpinner",
};

export interface AuthenticationSpinnerProps {
  onClose: () => void;
}

export default function SpinnerModal({ onClose }: AuthenticationSpinnerProps) {
  const { t } = useTranslation("authentication");
  const { modalColour } = useColours();

  return (
    <>
      <Modal
        isCentered
        isOpen={true}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          bg={modalColour.background}
          borderColor={modalColour.border}
          color={modalColour.foreground}
        >
          <Box borderWidth={1}>
            <Container centerContent={true}>
              <ModalHeader
                data-testid={testIDs.AuthenticationSpinnerModalTitle}
              >
                {t("spinnerTitle")}
              </ModalHeader>
            </Container>
            <ModalBody>
              <Center>
                <Spinner
                  data-testid={testIDs.AuthenticationSpinnerModalSpinner}
                  style={{ transform: "scale(1.5)" }}
                  thickness="8px"
                  size={"xl"}
                />
              </Center>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
