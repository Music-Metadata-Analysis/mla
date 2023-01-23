import { useRef } from "react";
import ReportSelect from "./select.report.component";
import config from "@src/config/lastfm";
import useFlags from "@src/hooks/flags.hook";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";

export default function ReportSelectContainer() {
  const flags = useFlags();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("lastfm");
  const threshold = useWindowThreshold({
    axis: "innerWidth",
    lowState: false,
    threshold: config.select.indicatorWidth,
  });

  const getEnabledReports = () =>
    config.select.options.filter((option) => {
      return flags.isEnabled(option.flag);
    });

  const reportOptionProps = getEnabledReports().map((option) => {
    return {
      analyticsName: option.analyticsName,
      buttonText: t(option.buttonTextKey),
      clickHandler: () => router.push(option.route),
      indicatorText: t(option.indicatorTextKey),
      displayIndicator: threshold.state,
    };
  });

  return (
    <ReportSelect
      reportOptionProps={reportOptionProps}
      scrollRef={scrollRef}
      titleText={t("select.title")}
    />
  );
}
