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
import { testIDs } from "./modal.spinner.identifiers";
import useColours from "@src/hooks/ui/colour.hook";

export interface AuthenticationSpinnerProps {
  onClose: () => void;
  titleText: string;
}

export default function SpinnerModal({
  onClose,
  titleText,
}: AuthenticationSpinnerProps) {
  const { modalColour } = useColours();

  return (
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
            <ModalHeader data-testid={testIDs.AuthenticationSpinnerModalTitle}>
              {titleText}
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
  );
}
