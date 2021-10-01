import UserInterfaceChakraProvider from "./ui.chakra/ui.chakra.provider";
import UserInterfaceImagesProvider from "./ui.images/ui.images.provider";
import BackGround from "../../components/background/background.component";

const UserInterfaceRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <UserInterfaceChakraProvider>
      <UserInterfaceImagesProvider>
        <BackGround>{children}</BackGround>
      </UserInterfaceImagesProvider>
    </UserInterfaceChakraProvider>
  );
};

export default UserInterfaceRootProvider;
