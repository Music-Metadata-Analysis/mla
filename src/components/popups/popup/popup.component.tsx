import { useToast, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import useUserInterface from "@src/hooks/ui";
import type { UserInterfacePopUpsComponentType } from "@src/types/ui/popups/ui.component.popups.types";
import type { PopUpNameType } from "@src/types/ui/popups/ui.popups.state.types";

export interface PopUpProps {
  name: PopUpNameType;
  message: string;
  Component: UserInterfacePopUpsComponentType;
}

export default function PopUp({ name, message, Component }: PopUpProps) {
  const ui = useUserInterface();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const toastProps = {
    position: "bottom-left" as const,
    status: "info" as const,
    duration: null,
    isClosable: true,
    render: () => (
      <Component
        message={message}
        onClose={() => {
          closeToast();
        }}
      />
    ),
  };

  const closeToast = () => {
    if (toast.isActive(name)) {
      toast.close(name);
      ui.popups.close(name);
    }
  };

  const openOrUpdateToast = () => {
    if (!toast.isActive(name)) {
      toast({
        id: name,
        ...toastProps,
      });
    } else {
      toast.update(name, toastProps);
    }
  };

  useEffect(() => {
    return () => closeToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ui.popups.status(name)) {
      openOrUpdateToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  return null;
}
