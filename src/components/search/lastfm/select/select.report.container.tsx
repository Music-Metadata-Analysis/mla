import { useRef } from "react";
import ReportSelect from "./select.report.component";
import config from "@src/config/lastfm";
import useFlags from "@src/hooks/flags.hook";
import useLocale from "@src/hooks/locale.hook";
import useRouter from "@src/hooks/router.hook";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";

export default function ReportSelectContainer() {
  const flags = useFlags();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale("lastfm");
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