import FeedbackPopUpContainer from "./feedback/feedback.popup.container";
import Condition from "@src/components/condition/condition.component";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";

export default function RootPopUpContainer() {
  return (
    <Condition isTrue={!webFrameworkVendor.isSSR()}>
      <FeedbackPopUpContainer />
    </Condition>
  );
}
