import FeedbackPopUpContainer from "./feedback.popup.container";
import Condition from "../condition/condition.component";
import webFrameworkVendor from "@src/clients/web.framework/vendor";

export default function RootPopUpContainer() {
  return (
    <Condition isTrue={!webFrameworkVendor.isSSR()}>
      <FeedbackPopUpContainer />
    </Condition>
  );
}
