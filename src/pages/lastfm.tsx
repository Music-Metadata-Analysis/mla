import { useState, useEffect } from "react";
import FourOhFour from "./404";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import Top20Report from "../components/reports/lastfm/top20/top20.container.component";
import settings from "../config/lastfm";
import routes from "../config/routes";
import Events from "../events/events";
import useLastFM from "../hooks/lastfm";
import pagePropsGenerator from "../utils/page.props.static";

export default function LastFM() {
  const [username, setUsername] = useState<string | null | undefined>(
    undefined
  );
  const user = useLastFM();

  useEffect(() => {
    if (username === undefined) {
      const urlParams = new URLSearchParams(window.location.search);
      setUsername(urlParams.get(settings.search.fieldName));
    }
  }, [username]);

  if (username === undefined) {
    return null;
  }

  if (username === null) {
    return <FourOhFour />;
  }

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={user.clear}
    >
      <Top20Report username={username} user={user} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["lastfm"],
});
