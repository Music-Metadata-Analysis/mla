import {
  Box,
  Center,
  Container,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import AuthenticationSpinnerModal from "../modal.spinner.component";
import { testIDs } from "../modal.spinner.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Box",
    "Center",
    "Container",
    "Modal",
    "ModalBody",
    "ModalContent",
    "ModalFooter",
    "ModalHeader",
    "ModalOverlay",
    "Spinner",
  ])
);

describe("AuthenticationSpinnerModal", () => {
  const mockTitleText = "mockTitleText";

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    render(
      <AuthenticationSpinnerModal
        onClose={mockOnClose}
        titleText={mockTitleText}
      />
    );
  };

  it("should render the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      borderWidth: 1,
    });
  });

  it("should render the Modal component correctly", () => {
    expect(Modal).toBeCalledTimes(1);
    checkMockCall(Modal, {
      isCentered: true,
      isOpen: true,
      onClose: mockOnClose,
      closeOnOverlayClick: false,
    });
  });

  it("should render the ModalOverlay component correctly", () => {
    expect(ModalOverlay).toBeCalledTimes(1);
    checkMockCall(ModalOverlay, {});
  });

  it("should render the ModalContent component correctly", () => {
    expect(ModalContent).toBeCalledTimes(1);
    checkMockCall(ModalContent, {
      color: mockColourHook.modalColour.foreground,
      borderColor: mockColourHook.modalColour.border,
      bg: mockColourHook.modalColour.background,
    });
  });

  it("should render the Container component correctly", () => {
    expect(Container).toBeCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
    });
  });

  it("should render the ModalHeader component correctly", () => {
    expect(ModalHeader).toBeCalledTimes(1);
    checkMockCall(ModalHeader, {
      "data-testid": testIDs.AuthenticationSpinnerModalTitle,
    });
  });

  it("should render the title text correctly", async () => {
    const container = await screen.findByTestId(
      testIDs.AuthenticationSpinnerModalTitle
    );
    expect(await within(container).findByText(mockTitleText)).toBeTruthy();
  });

  it("should render the ModalBody component correctly", () => {
    expect(ModalBody).toBeCalledTimes(1);
    checkMockCall(ModalBody, {});
  });

  it("should render the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, {});
  });

  it("should render the Spinner component correctly", () => {
    expect(Spinner).toBeCalledTimes(1);
    checkMockCall(Spinner, {
      size: "xl",
      "data-testid": testIDs.AuthenticationSpinnerModalSpinner,
      thickness: "8px",
      style: { transform: "scale(1.5)" },
    });
  });

  it("should render the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });
});
