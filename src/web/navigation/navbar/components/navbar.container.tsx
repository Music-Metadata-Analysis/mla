import NavBarRootContainer from "./root/navbar.root.container";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import useNavBarLayoutController from "@src/web/navigation/navbar/state/controllers/navbar.layout.controller.hook";
import Condition from "@src/web/ui/generics/components/condition/condition.component";

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
