import ImagesControllerProvider from "./images/images.provider";
import NavBarControllerProvider from "./navbar/navbar.provider";
import ScrollBarsControllerProvider from "./scrollbars/scrollbars.provider";

const ControllersRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <NavBarControllerProvider>
      <ImagesControllerProvider>
        <ScrollBarsControllerProvider>{children}</ScrollBarsControllerProvider>
      </ImagesControllerProvider>
    </NavBarControllerProvider>
  );
};

export default ControllersRootProvider;
