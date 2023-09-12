import FeedbackPopUpContainer from "./feedback/feedback.popup.container";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import Condition from "@src/web/ui/generics/components/condition/condition.component";

export default function RootPopUpContainer() {
  return (
    <Condition isTrue={!webFrameworkVendor.isSSR()}>
      <FeedbackPopUpContainer />
    </Condition>
  );
}
