import { useEffect } from "react";
import FeedbackPopUp from "./popups.components/feedback.popup.component";
import settings from "@src/config/popups";
import useAuth from "@src/hooks/auth.hook";
import usePopUpsController from "@src/hooks/controllers/popups.controller.hook";
import useLocale from "@src/hooks/locale.hook";
import useMetrics from "@src/hooks/metrics";
import usePopUpsGenerator from "@src/hooks/ui/popups.generator.hook";

const popUpName = "FeedBack" as const;

export default function FeedbackPopUpContainer() {
  const { status: authStatus } = useAuth();
  const { t } = useLocale("main");
  const { metrics } = useMetrics();
  const popups = usePopUpsController();

  usePopUpsGenerator({
    component: FeedbackPopUp,
    message: t(`popups.${popUpName}`),
    name: popUpName,
  });

  useEffect(() => {
    if (
      settings[popUpName].searchMetricCount.includes(metrics["SearchMetric"]) &&
      authStatus === "authenticated"
    ) {
      popups.open(popUpName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  return null;
}
