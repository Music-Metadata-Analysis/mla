import { useToast, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import usePopUps from "@src/hooks/popups";
import type { PopUpComponentType } from "@src/types/controllers/popups/component.popups.types";
import type { PopUpComponentNameType } from "@src/types/controllers/popups/popups.state.types";

export interface PopUpProps {
  name: PopUpComponentNameType;
  message: string;
  Component: PopUpComponentType;
}

export default function PopUp({ name, message, Component }: PopUpProps) {
  const popups = usePopUps();
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
      popups.close(name);
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
    if (popups.status(name)) {
      openOrUpdateToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  return null;
}
