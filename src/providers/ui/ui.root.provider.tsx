import UserInterfaceChakraProvider from "./ui.chakra/ui.chakra.provider";
import UserInterfaceImagesProvider from "./ui.images/ui.images.provider";
import UserInterfacePopUpsProvider from "./ui.popups/ui.popups.provider";
import BackGround from "@src/components/background/background.component";

const UserInterfaceRootProvider = ({
  children,
  cookies,
}: {
  children: JSX.Element;
  cookies: { [key: string]: string } | string;
}) => {
  return (
    <UserInterfaceChakraProvider cookies={cookies}>
      <UserInterfaceImagesProvider>
        <UserInterfacePopUpsProvider>
          <BackGround>{children}</BackGround>
        </UserInterfacePopUpsProvider>
      </UserInterfaceImagesProvider>
    </UserInterfaceChakraProvider>
  );
};

export default UserInterfaceRootProvider;
