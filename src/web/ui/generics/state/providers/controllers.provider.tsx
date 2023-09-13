import NavBarControllerProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";
import ImagesControllerProvider from "@src/web/ui/images/state/providers/images.provider";
import ScrollBarsControllerProvider from "@src/web/ui/scrollbars/generics/state/providers/scrollbars.provider";

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
