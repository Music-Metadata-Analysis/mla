import { useRef } from "react";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import Select from "@src/components/search/lastfm/select/select.report.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

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

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
