import { useDisclosure } from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthenticationComponent from "./authentication.component";

export interface AuthenticationProps {
  onModalClose?: () => void;
  hidden?: boolean;
}

export default function Authentication({
  hidden = false,
  onModalClose = undefined,
}: AuthenticationProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authSession, authStatus] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!authSession && !isOpen && !authStatus) {
      onOpen();
    }
    if (authSession && isOpen && authStatus) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession, authStatus]);

  const handleClose = () => {
    if (onModalClose) onModalClose();
    if (!onModalClose) router.back();
  };

  if (hidden) return null;

  return (
    <AuthenticationComponent
      signIn={signIn}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}
