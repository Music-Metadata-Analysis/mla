import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
} from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import mockColourHook from "../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import AlbumDrawer, { DrawerInterface, testIDs } from "../drawer.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create([
    "Divider",
    "Drawer",
    "DrawerBody",
    "DrawerHeader",
    "DrawerOverlay",
    "DrawerCloseButton",
    "DrawerContent",
  ]);
});

jest.mock("../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

const mockOnClose = jest.fn();

describe("AlbumDrawer", () => {
  const currentProps: DrawerInterface = {
    title: "Mock Title",
    isOpen: true,
    onClose: mockOnClose,
  };
  const mockChildComponent = "mockChildComponent";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    return render(
      <AlbumDrawer {...currentProps}>{mockChildComponent}</AlbumDrawer>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call Drawer once", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          "data-testid": testIDs.Drawer,
          isOpen: true,
          placement: "bottom",
        },
        0,
        ["onClose"]
      );
    });

    it("should call DrawerOverlay once", () => {
      expect(DrawerOverlay).toBeCalledTimes(1);
    });

    it("should call DrawerContent once", () => {
      expect(DrawerContent).toBeCalledTimes(1);
      checkMockCall(
        DrawerContent,
        {
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          sx: {
            caretColor: mockColourHook.transparent,
          },
        },
        0
      );
    });

    it("should call DrawerBody once", () => {
      expect(DrawerBody).toBeCalledTimes(1);
    });

    it("should call DrawerCloseButton once", () => {
      expect(DrawerCloseButton).toBeCalledTimes(1);
      checkMockCall(
        DrawerCloseButton,
        {
          "data-testid": testIDs.DrawerCloseButton,
          sx: {
            boxShadow: "none !important",
          },
        },
        0
      );
    });

    it("should call DrawerHeader once", () => {
      expect(DrawerHeader).toBeCalledTimes(1);
    });

    it("should call Divider 2 times", () => {
      expect(Divider).toBeCalledTimes(2);
    });

    it("should render the title text", async () => {
      const header = await screen.findByTestId(testIDs.DrawerHeader);
      expect(await within(header).findByText(currentProps.title)).toBeTruthy();
    });

    it("should render the child component", async () => {
      const body = await screen.findByTestId(testIDs.DrawerBody);
      expect(await within(body).findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
