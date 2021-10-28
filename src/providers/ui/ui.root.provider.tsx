import UserInterfaceChakraProvider from "./ui.chakra/ui.chakra.provider";
import UserInterfaceImagesProvider from "./ui.images/ui.images.provider";
import UserInterfacePopUpsProvider from "./ui.popups/ui.popups.provider";
import BackGround from "../../components/background/background.component";

const UserInterfaceRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <UserInterfaceChakraProvider>
      <UserInterfaceImagesProvider>
        <UserInterfacePopUpsProvider>
          <BackGround>{children}</BackGround>
        </UserInterfacePopUpsProvider>
      </UserInterfaceImagesProvider>
    </UserInterfaceChakraProvider>
  );
};

export default UserInterfaceRootProvider;
