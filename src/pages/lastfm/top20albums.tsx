import { useState, useEffect } from "react";
import ErrorBoundary from "../../components/errors/boundary/error.boundary.component";
import Top20AlbumsReport from "../../components/reports/lastfm/top20.albums/top20.albums.container";
import settings from "../../config/lastfm";
import routes from "../../config/routes";
import Events from "../../events/events";
import useLastFM from "../../hooks/lastfm";
import pagePropsGenerator from "../../utils/page.props.static";
import FourOhFour from "../404";
import type { userHookAsLastFMTop20AlbumReport } from "../../types/user/hook.types";

export default function LastFMTop20Albums() {
  const [userName, setUserName] = useState<string | null | undefined>(
    undefined
  );
  const user = useLastFM() as userHookAsLastFMTop20AlbumReport;

  useEffect(() => {
    if (userName === undefined) {
      const urlParams = new URLSearchParams(window.location.search);
      setUserName(urlParams.get(settings.search.fieldName));
    }
  }, [userName]);

  if (userName === undefined) {
    return null;
  }

  if (userName === null) {
    return <FourOhFour />;
  }

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={user.clear}
    >
      <Top20AlbumsReport userName={userName} user={user} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["cards", "lastfm"],
});
