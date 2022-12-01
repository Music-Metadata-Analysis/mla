import ImagesControllerProvider from "./images/images.provider";
import NavBarControllerProvider from "./navbar/navbar.provider";
import PopUpsControllerProvider from "./popups/popups.provider";
import ScrollBarsControllerProvider from "./scrollbars/scrollbars.provider";

const ControllersRootProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <NavBarControllerProvider>
      <ImagesControllerProvider>
        <PopUpsControllerProvider>
          <ScrollBarsControllerProvider>
            {children}
          </ScrollBarsControllerProvider>
        </PopUpsControllerProvider>
      </ImagesControllerProvider>
    </NavBarControllerProvider>
  );
};

export default ControllersRootProvider;
