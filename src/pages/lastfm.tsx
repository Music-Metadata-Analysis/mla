import { useState, useEffect } from "react";
import FourOhFour from "./404";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import Top20Report from "../components/reports/lastfm/top20/top20.component";
import Events from "../config/events";
import settings from "../config/lastfm";
import routes from "../config/routes";
import useLastFM from "../hooks/lastfm";
import pagePropsGenerator from "../utils/page.props.static";

export default function LastFM() {
  const [username, setUsername] = useState<string | null>(null);
  const user = useLastFM();

  useEffect(() => {
    if (username === null) {
      const urlParams = new URLSearchParams(window.location.search);
      setUsername(urlParams.get(settings.search.fieldName));
    }
  }, [username]);

  if (username === null) return <FourOhFour />;

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

export const getStaticProps = pagePropsGenerator({ pageKey: "lastfm" });
