import FeedbackPopup from "./feedback.popup";
import Condition from "../condition/condition.component";
import webFrameworkVendor from "@src/clients/web.framework/vendor";

export default function RootPopup() {
  return (
    <Condition isTrue={!webFrameworkVendor.isSSR()}>
      <FeedbackPopup />
    </Condition>
  );
}
