import { useDisclosure } from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthenticationComponent from "./authentication.component";
import routes from "../../config/routes";

export default function Authentication() {
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
    router.push(routes.home);
  };

  return (
    <AuthenticationComponent
      signIn={signIn}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}
