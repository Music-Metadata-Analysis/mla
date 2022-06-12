import { useRef } from "react";
import ErrorBoundary from "../../../components/errors/boundary/error.boundary.component";
import Select from "../../../components/search/lastfm/select/select.report.component";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import pagePropsGenerator from "../../../utils/page.props.static";
import { voidFn } from "../../../utils/voids";

export default function SplashPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <Select scrollRef={scrollRef} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
