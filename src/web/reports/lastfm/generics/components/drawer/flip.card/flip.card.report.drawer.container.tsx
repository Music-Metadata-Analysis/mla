import { useEffect } from "react";
import FlipCardDrawer from "./flip.card.report.drawer.component";
import settings from "@src/config/flip.card";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import type FlipCardReportStateBase from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { LastFMFlipCardDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/flip.card.types";

export default function FlipCardDrawerContainer<
  ReportStateType extends FlipCardReportStateBase
>({
  artWorkAltTranslatedText,
  fallbackImage,
  isOpen,
  objectIndex,
  onClose,
  reportStateInstance,
}: LastFMFlipCardDrawerInterface<ReportStateType>) {
  const analytics = useAnalytics();
  const { t } = useTranslation("lastfm");

  useEffect(() => {
    if (objectIndex === null) return;
    analytics.event(reportStateInstance.getDrawerEvent(objectIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectIndex]);

  if (objectIndex === null) return null;

  return (
    <FlipCardDrawer
      artWorkAltTranslatedText={artWorkAltTranslatedText}
      artWorkSourceUrl={reportStateInstance.getArtwork(
        objectIndex,
        settings.drawer.lastFMImageSize
      )}
      drawerTitle={reportStateInstance.getDrawerTitle(objectIndex)}
      externalLink={reportStateInstance.getExternalLink(objectIndex)}
      fallbackImage={fallbackImage}
      isOpen={isOpen}
      objectIndex={objectIndex}
      onClose={onClose}
      value={reportStateInstance.getPlayCount(objectIndex)}
      t={t}
    />
  );
}
