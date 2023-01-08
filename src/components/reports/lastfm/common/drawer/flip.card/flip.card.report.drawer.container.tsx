import { useEffect } from "react";
import FlipCardDrawer from "./flip.card.report.drawer.component";
import settings from "@src/config/flip.card";
import useAnalytics from "@src/hooks/analytics.hook";
import useLocale from "@src/hooks/locale.hook";
import type FlipCardReportStateBase from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { LastFMFlipCardDrawerInterface } from "@src/types/reports/lastfm/components/drawers/flip.card.types";

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
  const { t } = useLocale("lastfm");

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
