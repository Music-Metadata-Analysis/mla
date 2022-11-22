import {
  // @ts-ignore: mocked with forwardRef
  BoxWithRef,
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
import { render } from "@testing-library/react";
import SignInButtons from "../../buttons/signin.buttons";
import ModalComponent, { testIDs } from "../modal.signin.component";
import ClickLinkInternalContainer from "@src/components/clickable/click.link.internal/click.link.internal.container";
import VerticalScrollBar from "@src/components/scrollbar/vertical.scrollbar.component";
import routes from "@src/config/routes";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/colour");

jest.mock("@src/hooks/locale");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const instance = createChakraMock(
    [
      "Center",
      "Container",
      "Flex",
      "Modal",
      "ModalContent",
      "ModalHeader",
      "ModalFooter",
      "ModalBody",
    ],
    ["Box"]
  );
  instance.ModalOverlay = jest.fn(() => "ModalOverlay");
  instance.ModalCloseButton = jest.fn(() => "ModalCloseButton");
  return instance;
});

jest.mock("../../buttons/signin.buttons", () =>
  require("@fixtures/react/child").createComponent("SignInButtons")
);

jest.mock("@src/components/scrollbar/vertical.scrollbar.component", () =>
  require("@fixtures/react/child").createComponent("VerticalScrollBar")
);

jest.mock(
  "@src/components/clickable/click.link.internal/click.link.internal.container",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

const mockOnClose = jest.fn();
const mockSignIn = jest.fn();
const mockSetClicked = jest.fn();

describe("AuthenticationModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrange(true);
  });

  const arrange = (isOpen: boolean) => {
    render(
      <ModalComponent
        isOpen={isOpen}
        signIn={mockSignIn}
        setClicked={mockSetClicked}
        onClose={mockOnClose}
      />
    );
  };

  it("should call the Box component correctly", () => {
    expect(BoxWithRef).toBeCalledTimes(2);
    checkMockCall(
      BoxWithRef,
      {
        borderWidth: 1,
      },
      0
    );
    checkMockCall(
      BoxWithRef,
      {
        className: "scrollbar",
        id: "SignInProvidersScrollArea",
        maxHeight: "calc(100vh - 150px)",
      },
      1
    );
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
      bg: mockColourHook.modalColour.background,
      borderColor: mockColourHook.modalColour.border,
      color: mockColourHook.modalColour.foreground,
      m: 0,
      ml: 2,
      mr: 2,
    });
  });

  it("should call the Container component correctly", () => {
    expect(Container).toBeCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
    });
  });

  it("should call the ModalCloseButton component correctly", () => {
    expect(ModalCloseButton).toBeCalledTimes(1);
    checkMockCall(ModalCloseButton, {
      "data-testid": testIDs.AuthenticationModalCloseButton,
      sx: {
        boxShadow: "none !important",
      },
    });
  });

  it("should call the ModalHeader component correctly", () => {
    expect(ModalHeader).toBeCalledTimes(1);
    checkMockCall(ModalHeader, {
      "data-testid": testIDs.AuthenticationModalTitle,
    });
  });

  it("should call the ModalBody component correctly", () => {
    expect(ModalBody).toBeCalledTimes(1);
    checkMockCall(ModalBody, {
      pl: 2,
      pr: 2,
    });
  });

  it("should call the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, {});
  });

  it("should call the Flex component correctly", () => {
    expect(Flex).toBeCalledTimes(2);
    checkMockCall(
      Flex,
      {
        "data-testid": testIDs.AuthenticationLoginButtons,
        direction: "column",
      },
      0
    );
    checkMockCall(
      Flex,
      {
        "data-testid": testIDs.AuthenticationModalFooter,
        textDecoration: "underline",
        justify: "center",
        align: "center",
        w: "100%",
      },
      1,
      ["onClick"]
    );
  });

  it("should call the VerticalScrollBar component correctly", () => {
    expect(VerticalScrollBar).toBeCalledTimes(1);
    const call = jest.mocked(VerticalScrollBar).mock.calls[0][0];
    expect(call.scrollRef).toBeDefined();
    expect(call.update).toBe(null);
    expect(call.horizontalOffset).toBe(10);
    expect(call.verticalOffset).toBe(0);
    expect(call.zIndex).toBe(10000);
    expect(Object.keys(call).length).toBe(5);
  });

  it("should call the SignInButtons component correctly", () => {
    expect(SignInButtons).toBeCalledTimes(1);
    const call = jest.mocked(SignInButtons).mock.calls[0][0];
    expect(call.signIn).toBe(mockSignIn);
    expect(call.setClicked).toBe(mockSetClicked);
    expect(typeof call.t).toBe("function");
    expect(Object.keys(call).length).toBe(3);
  });

  it("should call the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });

  it("should call the ClickLinkInternalContainer component correctly", () => {
    expect(ClickLinkInternalContainer).toBeCalledTimes(1);
    checkMockCall(ClickLinkInternalContainer, {
      path: routes.legal.terms,
    });
  });
});
