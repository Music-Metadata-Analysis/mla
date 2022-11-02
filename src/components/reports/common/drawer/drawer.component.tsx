import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
} from "@chakra-ui/react";
import useColour from "@src/hooks/colour";
import type { PropsWithChildren } from "react";

export interface DrawerInterface {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  placement: "bottom" | "left" | "right" | "top";
  alwaysOpen?: boolean;
}

export const testIDs = {
  Drawer: "Drawer",
  DrawerBody: "DrawerBody",
  DrawerCloseButton: "DrawerCloseButton",
  DrawerHeader: "DrawerHeader",
};

const ReportDrawer = ({
  children,
  title,
  isOpen,
  onClose,
  alwaysOpen,
  placement,
}: PropsWithChildren<DrawerInterface>) => {
  const { componentColour, transparent } = useColour();

  const placementOpposites = {
    bottom: "Top",
    left: "Right",
    right: "Left",
    top: "Bottom",
  };

  const getBorderProps = () => {
    return {
      [`border${placementOpposites[placement]}`]: "1px",
    };
  };

  return (
    <Drawer
      data-testid={testIDs.Drawer}
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      variant={alwaysOpen ? "alwaysOpen" : undefined}
    >
      {alwaysOpen ? null : <DrawerOverlay />}
      <DrawerContent
        bg={componentColour.background}
        color={componentColour.foreground}
        borderColor={componentColour.foreground}
        sx={{
          caretColor: transparent,
        }}
        pointerEvents={"auto"}
        {...getBorderProps()}
      >
        <DrawerCloseButton
          data-testid={testIDs.DrawerCloseButton}
          sx={{
            boxShadow: "none !important",
          }}
        />
        {title ? (
          <DrawerHeader data-testid={testIDs.DrawerHeader}>
            {title}
          </DrawerHeader>
        ) : null}
        <Divider
          style={{ background: componentColour.scheme }}
          orientation="horizontal"
        />
        <DrawerBody data-testid={testIDs.DrawerBody}>{children}</DrawerBody>
        <Divider
          style={{ background: componentColour.scheme }}
          mb={2}
          orientation="horizontal"
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ReportDrawer;
