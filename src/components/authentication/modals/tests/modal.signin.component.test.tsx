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
import { render } from "@testing-library/react";
import routes from "../../../../config/routes";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import ClickLink from "../../../clickable/click.link.internal/click.link.internal.component";
import SignInButtons from "../../buttons/signin.buttons";
import ModalComponent, { testIDs } from "../modal.signin.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  const instance = factoryInstance.create([
    "Box",
    "Center",
    "Container",
    "Flex",
    "Modal",
    "ModalContent",
    "ModalHeader",
    "ModalFooter",
    "ModalBody",
  ]);
  instance.ModalOverlay = jest.fn(() => "ModalOverlay");
  instance.ModalCloseButton = jest.fn(() => "ModalCloseButton");
  return instance;
});

jest.mock("../../buttons/signin.buttons", () =>
  jest.fn(() => <div>MockSignInButtons</div>)
);

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock(
  "../../../clickable/click.link.internal/click.link.internal.component",
  () => createMockedComponent("ClickLink")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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
    checkMockCall(ModalBody, {});
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

  it("should call the SignInButtons component correctly", () => {
    expect(SignInButtons).toBeCalledTimes(1);
    const call = (SignInButtons as jest.Mock).mock.calls[0][0];
    expect(call.signIn).toBe(mockSignIn);
    expect(call.setClicked).toBe(mockSetClicked);
    expect(typeof call.t).toBe("function");
    expect(Object.keys(call).length).toBe(3);
  });

  it("should call the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });

  it("should call the ClickLink component correctly", () => {
    expect(ClickLink).toBeCalledTimes(1);
    checkMockCall(ClickLink, {
      href: routes.legal.terms,
    });
  });
});
