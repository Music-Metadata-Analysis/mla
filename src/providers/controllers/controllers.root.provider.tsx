import ImagesControllerProvider from "./images/images.provider";
import NavBarControllerProvider from "./navbar/navbar.provider";
import PopUpsControllerProvider from "./popups/popups.provider";

const ControllersRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <NavBarControllerProvider>
      <ImagesControllerProvider>
        <PopUpsControllerProvider>{children}</PopUpsControllerProvider>
      </ImagesControllerProvider>
    </NavBarControllerProvider>
  );
};

export default ControllersRootProvider;
