import { useToast } from "@chakra-ui/react";

export default function useChakraForm() {
  const toast = useToast();

  const closeError = (fieldname: string) => {
    if (toast.isActive(fieldname)) {
      toast.close(fieldname);
    }
  };

  const openError = (fieldname: string, message: string) => {
    if (!toast.isActive(fieldname)) {
      toast({
        id: fieldname,
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    } else {
      toast.update(fieldname, {
        title: message,
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    }
  };

  return {
    error: {
      close: closeError,
      open: openError,
    },
  };
}
