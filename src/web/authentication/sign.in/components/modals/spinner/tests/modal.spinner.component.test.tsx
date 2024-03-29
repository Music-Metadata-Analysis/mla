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
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

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
    expect(Box).toHaveBeenCalledTimes(1);
    checkMockCall(Box, {
      borderWidth: 1,
    });
  });

  it("should render the Modal component correctly", () => {
    expect(Modal).toHaveBeenCalledTimes(1);
    checkMockCall(Modal, {
      isCentered: true,
      isOpen: true,
      onClose: mockOnClose,
      closeOnOverlayClick: false,
    });
  });

  it("should render the ModalOverlay component correctly", () => {
    expect(ModalOverlay).toHaveBeenCalledTimes(1);
    checkMockCall(ModalOverlay, {});
  });

  it("should render the ModalContent component correctly", () => {
    expect(ModalContent).toHaveBeenCalledTimes(1);
    checkMockCall(ModalContent, {
      color: mockColourHook.modalColour.foreground,
      borderColor: mockColourHook.modalColour.border,
      bg: mockColourHook.modalColour.background,
    });
  });

  it("should render the Container component correctly", () => {
    expect(Container).toHaveBeenCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
    });
  });

  it("should render the ModalHeader component correctly", () => {
    expect(ModalHeader).toHaveBeenCalledTimes(1);
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
    expect(ModalBody).toHaveBeenCalledTimes(1);
    checkMockCall(ModalBody, {});
  });

  it("should render the Center component correctly", () => {
    expect(Center).toHaveBeenCalledTimes(1);
    checkMockCall(Center, {});
  });

  it("should render the Spinner component correctly", () => {
    expect(Spinner).toHaveBeenCalledTimes(1);
    checkMockCall(Spinner, {
      size: "xl",
      "data-testid": testIDs.AuthenticationSpinnerModalSpinner,
      thickness: "8px",
      style: { transform: "scale(1.5)" },
    });
  });

  it("should render the ModalFooter component correctly", () => {
    expect(ModalFooter).toHaveBeenCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });
});
