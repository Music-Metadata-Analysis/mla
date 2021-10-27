import ErrorBoundary from "../../components/errors/boundary/error.boundary.component";
import TermsOfService from "../../components/legal/terms/terms.component";
import routes from "../../config/routes";
import Events from "../../events/events";
import pagePropsGenerator from "../../utils/page.props.static";
import { voidFn } from "../../utils/voids";

export default function TermsOfServicePage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <TermsOfService />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "privacy",
  translations: ["legal"],
});
