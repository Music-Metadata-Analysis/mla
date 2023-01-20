import ImagesControllerProvider from "./images/images.provider";
import ScrollBarsControllerProvider from "./scrollbars/scrollbars.provider";
import NavBarControllerProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";

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
