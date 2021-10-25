import ErrorBoundary from "../../components/errors/boundary/error.boundary.component";
import Privacy from "../../components/legal/privacy/privacy.component";
import routes from "../../config/routes";
import Events from "../../events/events";
import pagePropsGenerator from "../../utils/page.props.static";
import { voidFn } from "../../utils/voids";

export default function PrivacyPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <Privacy />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "privacy",
  translations: ["legal"],
});
