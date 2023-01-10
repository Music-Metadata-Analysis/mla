import { useToast, useColorMode } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { PopUpsControllerContext } from "@src/vendors/integrations/ui.framework/popups/provider/popups.provider";
import type { UIVendorCreatePopUpHookInterface } from "@src/vendors/types/integrations/ui.framework/vendor.types";

export default function useChakraPopUp(
  props: UIVendorCreatePopUpHookInterface
) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const popups = useContext(PopUpsControllerContext);

  const toastProps = {
    position: "bottom-left" as const,
    status: "info" as const,
    duration: null,
    isClosable: true,
    render: () => (
      <props.component message={props.message} onClose={closeToast} />
    ),
  };

  useEffect(() => {
    // PopUps Start Closed
    return () => closeToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // PopUps Open On A State Change
    if (popups.state[props.name].status) {
      createToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popups.state]);

  useEffect(() => {
    // PopUps Are Redrawn During a Colour Mode Change
    if (popups.state[props.name].status) {
      updateToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  const closeToast = () => {
    toast.close(props.name);
    popups.dispatch({ type: "HidePopUp", name: props.name });
  };

  const createToast = () => {
    if (!toast.isActive(props.name)) {
      toast({
        id: props.name,
        ...toastProps,
      });
    }
  };

  const updateToast = () => {
    if (toast.isActive(props.name)) {
      toast.update(props.name, toastProps);
    }
  };

  return null;
}
