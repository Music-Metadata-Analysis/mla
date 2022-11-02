import BackGround from "./background/background.component";
import UserInterfaceChakraProvider from "./chakra/chakra.provider";

const UserInterfaceRootProvider = ({
  children,
  cookies,
}: {
  children: JSX.Element;
  cookies: { [key: string]: string } | string;
}) => {
  return (
    <UserInterfaceChakraProvider cookies={cookies}>
      <BackGround>{children}</BackGround>
    </UserInterfaceChakraProvider>
  );
};

export default UserInterfaceRootProvider;
