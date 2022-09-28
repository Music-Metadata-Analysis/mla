import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import TermsOfService from "@src/components/legal/terms/terms.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import pagePropsGenerator from "@src/utils/page.props.static";
import { voidFn } from "@src/utils/voids";

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
  pageKey: "terms",
  translations: ["legal"],
});
