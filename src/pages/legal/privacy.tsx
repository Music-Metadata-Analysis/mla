import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import Privacy from "@src/components/legal/privacy/privacy.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import pagePropsGenerator from "@src/utils/page.props.static";
import { voidFn } from "@src/utils/voids";

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
