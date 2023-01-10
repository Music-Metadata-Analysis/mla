import useNavBarLayoutController from "./controllers/navbar.layout.controller.hook";
import NavBarRootContainer from "./root/navbar.root.container";
import Condition from "@src/components/condition/condition.component";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";

interface NavBarProps {
  config: { [index: string]: string };
}

export default function NavBar({ config }: NavBarProps) {
  const controller = useNavBarLayoutController();

  return (
    <Condition isTrue={!webFrameworkVendor.isBuildTime()}>
      <Condition isTrue={controller.controls.navigation.state}>
        <NavBarRootContainer config={config} controller={controller} />
      </Condition>
    </Condition>
  );
}
