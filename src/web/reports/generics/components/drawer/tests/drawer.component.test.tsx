import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentProps,
} from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import ReportDrawer, { ReportDrawerProps } from "../drawer.component";
import { testIDs } from "../drawer.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Divider",
    "Drawer",
    "DrawerBody",
    "DrawerHeader",
    "DrawerOverlay",
    "DrawerCloseButton",
    "DrawerContent",
  ])
);

describe("ReportDrawer", () => {
  let mockAlwaysOpen: boolean;
  let mockIsOpen: boolean;
  let mockTitle: undefined | string;
  let mockPlacement: "bottom" | "left" | "right" | "top";
  let currentProps: ReportDrawerProps;

  const mockChildComponent = "mockChildComponent";
  const mockOnClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const createProps = () =>
    (currentProps = {
      alwaysOpen: mockAlwaysOpen,
      title: mockTitle,
      isOpen: mockIsOpen,
      onClose: mockOnClose,
      placement: mockPlacement,
    });

  const arrange = () => {
    createProps();
    return render(
      <ReportDrawer {...currentProps}>{mockChildComponent}</ReportDrawer>
    );
  };

  const checkDrawerProps = ({
    alwaysOpen,
    isOpen,
    placement,
  }: {
    alwaysOpen: ReportDrawerProps["alwaysOpen"];
    isOpen: ReportDrawerProps["isOpen"];
    placement: ReportDrawerProps["placement"];
  }) => {
    it("should call the Drawer component with the expected props", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          "data-testid": testIDs.Drawer,
          isOpen,
          placement,
          variant: alwaysOpen ? "alwaysOpen" : undefined,
        },
        0,
        ["onClose"]
      );
    });
  };

  const checkDrawerOverlayProps = ({
    alwaysOpen,
    isOpen,
  }: {
    alwaysOpen: ReportDrawerProps["alwaysOpen"];
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (alwaysOpen || !isOpen) {
      it("should NOT call the DrawerOverlay component", () => {
        expect(DrawerOverlay).toBeCalledTimes(0);
      });
    } else {
      it("should call the DrawerOverlay component with the expected props", () => {
        expect(DrawerOverlay).toBeCalledTimes(1);
        checkMockCall(DrawerOverlay, {}, 0);
      });
    }
  };

  const checkDrawerContentProps = ({
    borderProps,
    isOpen,
  }: {
    borderProps: DrawerContentProps;
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (isOpen) {
      it("should call the DrawerContent component with the expected props", () => {
        expect(DrawerContent).toBeCalledTimes(1);
        checkMockCall(
          DrawerContent,
          {
            bg: mockColourHook.componentColour.background,
            color: mockColourHook.componentColour.foreground,
            sx: {
              caretColor: mockColourHook.transparent,
            },
            pointerEvents: "auto",
            ...borderProps,
          },
          0
        );
      });
    } else {
      it("should NOT call the DrawerContent component", () => {
        expect(DrawerContent).toBeCalledTimes(0);
      });
    }
  };

  const checkDrawerCloseButtonProps = ({
    isOpen,
  }: {
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (isOpen) {
      it("should call the DrawerCloseButton component with the expected props", () => {
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
    } else {
      it("should NOT call the DrawerCloseButton component", () => {
        expect(DrawerCloseButton).toBeCalledTimes(0);
      });
    }
  };

  const checkDrawerHeaderProps = ({
    title,
    isOpen,
  }: {
    title: ReportDrawerProps["title"];
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (title && isOpen) {
      it("should call the DrawerHeader component with the correct props", () => {
        expect(DrawerHeader).toBeCalledTimes(1);
        checkMockCall(DrawerHeader, {
          "data-testid": testIDs.DrawerHeader,
        });
      });

      it("should render the title text", async () => {
        const header = await screen.findByTestId(testIDs.DrawerHeader);
        expect(
          await within(header).findByText(String(currentProps.title))
        ).toBeTruthy();
      });
    } else {
      it("should NOT call the DrawerHeader component", () => {
        expect(DrawerHeader).toBeCalledTimes(0);
      });
    }
  };

  const checkDrawerBodyProps = ({
    isOpen,
  }: {
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (isOpen) {
      it("should call the DrawerBody component with the expected props", () => {
        expect(DrawerBody).toBeCalledTimes(1);
        checkMockCall(DrawerBody, { "data-testid": testIDs.DrawerBody });
      });
    } else {
      it("should NOT call the DrawerBody component ", () => {
        expect(DrawerBody).toBeCalledTimes(0);
      });
    }
  };

  const checkDividerProps = ({
    isOpen,
  }: {
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (isOpen) {
      it("should call the Divider component with the expected props", () => {
        expect(Divider).toBeCalledTimes(2);
        checkMockCall(
          Divider,
          {
            style: { background: mockColourHook.componentColour.scheme },
            orientation: "horizontal",
          },
          0
        );
        checkMockCall(
          Divider,
          {
            style: { background: mockColourHook.componentColour.scheme },
            mb: 2,
            orientation: "horizontal",
          },
          1
        );
      });
    } else {
      it("should NOT call the Divider component", () => {
        expect(Divider).toBeCalledTimes(0);
      });
    }
  };

  const checkChildComponent = ({
    isOpen,
  }: {
    isOpen: ReportDrawerProps["isOpen"];
  }) => {
    if (isOpen) {
      it("should render the child component", async () => {
        const body = await screen.findByTestId(testIDs.DrawerBody);
        expect(await within(body).findByText(mockChildComponent)).toBeTruthy();
      });
    } else {
      it("should NOT render the child component", async () => {
        expect(screen.queryByTestId(testIDs.DrawerBody)).toBeFalsy();
      });
    }
  };

  describe("when given a title", () => {
    beforeEach(() => (mockTitle = "Mock Report Title"));

    describe("when isOpen is true", () => {
      beforeEach(() => (mockIsOpen = true));

      describe("when placement is left", () => {
        beforeEach(() => (mockPlacement = "left"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: true,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: true,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });
      });

      describe("when placement is bottom", () => {
        beforeEach(() => (mockPlacement = "bottom"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: true,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: true,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });
      });
    });

    describe("when isOpen is false", () => {
      beforeEach(() => (mockIsOpen = false));

      describe("when placement is left", () => {
        beforeEach(() => (mockPlacement = "left"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: false,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: false,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });
      });

      describe("when placement is bottom", () => {
        beforeEach(() => (mockPlacement = "bottom"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: false,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: false,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: "Mock Report Title" });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });
      });
    });
  });

  describe("when NOT given a title", () => {
    beforeEach(() => (mockTitle = undefined));

    describe("when isOpen is true", () => {
      beforeEach(() => (mockIsOpen = true));

      describe("when placement is left", () => {
        beforeEach(() => (mockPlacement = "left"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: true,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: undefined });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: true,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: undefined });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });
      });

      describe("when placement is bottom", () => {
        beforeEach(() => (mockPlacement = "bottom"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: true,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: undefined });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: true,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: true });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: true,
          });
          checkDrawerCloseButtonProps({ isOpen: true });
          checkDrawerHeaderProps({ isOpen: true, title: undefined });
          checkDrawerBodyProps({ isOpen: true });
          checkDividerProps({ isOpen: true });
          checkChildComponent({ isOpen: true });
        });
      });
    });

    describe("when isOpen is false", () => {
      beforeEach(() => (mockIsOpen = false));

      describe("when placement is left", () => {
        beforeEach(() => (mockPlacement = "left"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: false,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: undefined });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: false,
            placement: "left",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderRight: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: undefined });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });
      });

      describe("when placement is bottom", () => {
        beforeEach(() => (mockPlacement = "bottom"));

        describe("when alwaysOpen is true", () => {
          beforeEach(() => {
            mockAlwaysOpen = true;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: true,
            isOpen: false,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: true, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: undefined });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });

        describe("when alwaysOpen is false", () => {
          beforeEach(() => {
            mockAlwaysOpen = false;
            arrange();
          });

          checkDrawerProps({
            alwaysOpen: false,
            isOpen: false,
            placement: "bottom",
          });
          checkDrawerOverlayProps({ alwaysOpen: false, isOpen: false });
          checkDrawerContentProps({
            borderProps: {
              borderTop: "1px",
              borderColor: mockColourHook.componentColour.foreground,
            },
            isOpen: false,
          });
          checkDrawerCloseButtonProps({ isOpen: false });
          checkDrawerHeaderProps({ isOpen: false, title: undefined });
          checkDrawerBodyProps({ isOpen: false });
          checkDividerProps({ isOpen: false });
          checkChildComponent({ isOpen: false });
        });
      });
    });
  });
});
