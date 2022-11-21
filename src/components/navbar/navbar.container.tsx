import useNavBarDisplayController from "./navbar.controllers/navbar.ui.controller";
import NavBarRootContainer from "./navbar.root/navbar.root.container";
import webFrameworkVendor from "@src/clients/web.framework/vendor";
import Condition from "@src/components/condition/condition.component";

interface NavBarProps {
  config: { [index: string]: string };
}

export default function NavBar({ config }: NavBarProps) {
  const controller = useNavBarDisplayController();

  return (
    <Condition isTrue={!webFrameworkVendor.isBuildTime()}>
      <Condition isTrue={controller.controls.navigation.state}>
        <NavBarRootContainer config={config} controller={controller} />
      </Condition>
    </Condition>
  );
}
