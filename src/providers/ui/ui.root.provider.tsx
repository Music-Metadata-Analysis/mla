import UserInterfaceChakraProvider from "./ui.chakra/ui.chakra.provider";
import BackGround from "../../components/background/background.component";

const UserInterfaceRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <UserInterfaceChakraProvider>
      <BackGround>{children}</BackGround>
    </UserInterfaceChakraProvider>
  );
};

export default UserInterfaceRootProvider;
