import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
} from "@chakra-ui/react";
import useColour from "../../../../hooks/colour";
import type { PropsWithChildren } from "react";

export interface DrawerInterface {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const testIDs = {
  Drawer: "Drawer",
  DrawerBody: "DrawerBody",
  DrawerCloseButton: "DrawerCloseButton",
  DrawerHeader: "DrawerHeader",
};

const AlbumDrawer = ({
  children,
  title,
  isOpen,
  onClose,
}: PropsWithChildren<DrawerInterface>) => {
  const { componentColour, transparent } = useColour();

  return (
    <Drawer
      data-testid={testIDs.Drawer}
      placement={"bottom"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent
        bg={componentColour.background}
        color={componentColour.foreground}
        sx={{
          caretColor: transparent,
        }}
      >
        <DrawerCloseButton
          data-testid={testIDs.DrawerCloseButton}
          sx={{
            boxShadow: "none !important",
          }}
        />
        <DrawerHeader data-testid={testIDs.DrawerHeader}>{title}</DrawerHeader>
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

export default AlbumDrawer;
