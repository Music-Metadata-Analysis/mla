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
import { render } from "@testing-library/react";
import ModalSpinner, { testIDs } from "../modal.spinner.component";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const instance = createChakraMock([
    "Box",
    "Center",
    "Container",
    "Modal",
    "ModalContent",
    "ModalHeader",
    "ModalFooter",
    "ModalBody",
    "Spinner",
  ]);
  instance.ModalOverlay = jest.fn(() => "ModalOverlay");
  return instance;
});

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

const mockOnClose = jest.fn();

describe("AuthenticationSpinnerModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<ModalSpinner onClose={mockOnClose} />);
  };

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      borderWidth: 1,
    });
  });

  it("should call the Modal component correctly", () => {
    expect(Modal).toBeCalledTimes(1);
    checkMockCall(Modal, {
      isCentered: true,
      isOpen: true,
      onClose: mockOnClose,
      closeOnOverlayClick: false,
    });
  });

  it("should call the ModalOverlay component correctly", () => {
    expect(ModalOverlay).toBeCalledTimes(1);
    checkMockCall(ModalOverlay, {});
  });

  it("should call the ModalContent component correctly", () => {
    expect(ModalContent).toBeCalledTimes(1);
    checkMockCall(ModalContent, {
      color: mockColourHook.modalColour.foreground,
      borderColor: mockColourHook.modalColour.border,
      bg: mockColourHook.modalColour.background,
    });
  });

  it("should call the Container component correctly", () => {
    expect(Container).toBeCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
    });
  });

  it("should call the ModalHeader component correctly", () => {
    expect(ModalHeader).toBeCalledTimes(1);
    checkMockCall(ModalHeader, {
      "data-testid": testIDs.AuthenticationSpinnerModalTitle,
    });
  });

  it("should call the ModalBody component correctly", () => {
    expect(ModalBody).toBeCalledTimes(1);
    checkMockCall(ModalBody, {});
  });

  it("should call the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, {});
  });

  it("should call the Spinner component correctly", () => {
    expect(Spinner).toBeCalledTimes(1);
    checkMockCall(Spinner, {
      size: "xl",
      "data-testid": testIDs.AuthenticationSpinnerModalSpinner,
      thickness: "8px",
      style: { transform: "scale(1.5)" },
    });
  });

  it("should call the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });
});
