import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Top20AlbumsReport from "./top20.albums.component";
import routes from "../../../../config/routes";
import Events from "../../../../events/events";
import useAnalytics from "../../../../hooks/analytics";
import BillBoardSpinner from "../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../errors/display/error.display.component";
import type useLastFM from "../../../../hooks/lastfm";
interface Top20AlbumsReportContainerProps {
  username: string;
  user: ReturnType<typeof useLastFM>;
}

export default function Top20AlbumsContainer({
  user,
  username,
}: Top20AlbumsReportContainerProps) {
  const { t } = useTranslation("lastfm");
  const analytics = useAnalytics();
  const router = useRouter();
  const [loadedImagesCounter, setLoadedImagesCounter] = useState(0);

  useEffect(() => {
    setLoadedImagesCounter(0);
  }, []);

  useEffect(() => {
    user.clear();
    user.top20albums(username);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (user.userProperties.userName === null) return;
    if (user.userProperties.inProgress) return;
    if (user.userProperties.ready) return;
    if (loadedImagesCounter >= getNumberOfImageLoads()) {
      user.ready();
      analytics.event(Events.LastFM.Top20Albums.ReportPresented);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedImagesCounter, user.userProperties]);

  const imageIsLoaded = () => {
    setLoadedImagesCounter((prevState) => prevState + 1);
  };

  const getNumberOfAlbums = () => {
    return user.userProperties.data.report.albums.length;
  };

  const getNumberOfImageLoads = () => {
    return getNumberOfAlbums() * 2;
  };

  const userHasNoListens = () => {
    return (
      user.userProperties.ready &&
      user.userProperties.userName !== null &&
      getNumberOfAlbums() === 0
    );
  };

  if (user.userProperties.error === "RatelimitedFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfm_ratelimited"}
        resetError={() => router.reload()}
      />
    );
  }

  if (user.userProperties.error === "NotFoundFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"user_not_found"}
        resetError={() => router.push(routes.search.lastfm.top20albums)}
      />
    );
  }

  if (user.userProperties.error === "FailureFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfm_communications"}
        resetError={() => router.push(routes.search.lastfm.top20albums)}
      />
    );
  }

  if (userHasNoListens()) {
    return (
      <ErrorDisplay
        errorKey={"user_with_no_listens"}
        resetError={() => router.push(routes.search.lastfm.top20albums)}
      />
    );
  }

  return (
    <>
      <BillBoardSpinner
        title={t("top20Albums.communication")}
        visible={!user.userProperties.ready}
      />
      <Top20AlbumsReport
        visible={user.userProperties.ready}
        user={user}
        imageIsLoaded={imageIsLoaded}
      />
    </>
  );
}
